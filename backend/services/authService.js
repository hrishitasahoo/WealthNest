const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { AppError } = require('../utils/AppError');
const { validateEmail, validatePassword, validateRequired } = require('../utils/validators');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;
const VALID_LANGUAGES = ['en', 'hi', 'hinglish', 'bn', 'ta', 'mr'];

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

module.exports = { register, login };
