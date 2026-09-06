const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const { AppError } = require('../utils/AppError');
const { validateEmail, validatePassword, validateRequired, isNonEmptyString } = require('../utils/validators');
const { signToken } = require('../utils/jwt');
const { sendPasswordResetEmail } = require('../utils/mailer');

const SALT_ROUNDS = 10;
const VALID_LANGUAGES = ['en', 'hi', 'bn', 'mr', 'ta', 'te'];
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

async function register({ fullName, email, password, confirmPassword, preferredLanguage }) {
  validateRequired({ 'Full name': fullName, Email: email, Password: password, 'Confirm password': confirmPassword });
  validateEmail(email);
  validatePassword(password);

  if (password !== confirmPassword) {
    throw new AppError('Passwords do not match.', 400, 'PASSWORD_MISMATCH');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await userModel.findUserByEmail(normalizedEmail);
  if (existing) {
    throw new AppError('An account with this email already exists.', 409, 'DUPLICATE_EMAIL');
  }

  const lang = VALID_LANGUAGES.includes(preferredLanguage) ? preferredLanguage : 'en';
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const userId = await userModel.createUser({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
    preferredLanguage: lang,
    username: null
  });

  const user = await userModel.findUserById(userId);
  const token = signToken({ userId });

  return { user, token };
}

async function login({ email, password }) {
  validateRequired({ Email: email, Password: password });
  validateEmail(email);

  const normalizedEmail = email.trim().toLowerCase();
  const user = await userModel.findUserByEmail(normalizedEmail);
  if (!user) {
    throw new AppError('Incorrect email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    throw new AppError('Incorrect email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const token = signToken({ userId: user.id });
  const { password_hash, ...safeUser } = user;

  return { user: safeUser, token };
}

const GENERIC_RESET_MESSAGE = 'If an account with that email exists, a password reset link has been sent.';

function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

async function requestPasswordReset(email, baseUrl) {
  validateRequired({ Email: email });
  validateEmail(email);
  const normalizedEmail = email.trim().toLowerCase();

  const user = await userModel.findUserByEmail(normalizedEmail);
  if (!user) {
    return { message: GENERIC_RESET_MESSAGE };
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await userModel.setResetToken(user.id, tokenHash, expiresAt);

  const resetUrl = `${baseUrl}/reset-password.html?token=${rawToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  return { message: GENERIC_RESET_MESSAGE };
}

async function resetPassword({ token, newPassword, confirmNewPassword }) {
  if (!isNonEmptyString(token)) {
    throw new AppError('This reset link is invalid or has expired. Please request a new one.', 400, 'INVALID_RESET_TOKEN');
  }
  validateRequired({ 'New password': newPassword, 'Confirm new password': confirmNewPassword });
  if (newPassword !== confirmNewPassword) {
    throw new AppError('Passwords do not match.', 400, 'PASSWORD_MISMATCH');
  }
  validatePassword(newPassword);

  const tokenHash = hashToken(token);
  const user = await userModel.findUserByResetTokenHash(tokenHash);

  if (!user) {
    throw new AppError('This reset link is invalid or has expired. Please request a new one.', 400, 'INVALID_RESET_TOKEN');
  }

  if (!user.reset_token_expires || new Date(user.reset_token_expires).getTime() < Date.now()) {
    await userModel.clearResetToken(user.id);
    throw new AppError('This reset link has expired. Please request a new one.', 400, 'EXPIRED_RESET_TOKEN');
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await userModel.updatePasswordHash(user.id, passwordHash);
  await userModel.clearResetToken(user.id);

  return { message: 'Your password has been reset. You can now log in with your new password.' };
}

module.exports = { register, login, requestPasswordReset, resetPassword };
