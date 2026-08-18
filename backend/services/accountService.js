const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { AppError } = require('../utils/AppError');
const { validateEmail, validatePassword, isNonEmptyString } = require('../utils/validators');

const USERNAME_MIN = 3;
const USERNAME_MAX = 30;
const USERNAME_REGEX = /^[a-zA-Z0-9_.]+$/;

function validateUsername(username) {
  if (!isNonEmptyString(username)) {
    throw new AppError('Username cannot be empty.', 400, 'INVALID_USERNAME');
  }
  const trimmed = username.trim();
  if (trimmed.length < USERNAME_MIN || trimmed.length > USERNAME_MAX) {
    throw new AppError(`Username must be between ${USERNAME_MIN} and ${USERNAME_MAX} characters.`, 400, 'INVALID_USERNAME');
  }
  if (!USERNAME_REGEX.test(trimmed)) {
    throw new AppError('Username can only contain letters, numbers, dots and underscores.', 400, 'INVALID_USERNAME');
  }
  return trimmed;
}

async function updateAccount(userId, { username, email }) {
  const cleanUsername = validateUsername(username);
  validateEmail(email);
  const cleanEmail = email.trim().toLowerCase();

  const existingByUsername = await userModel.findUserByUsername(cleanUsername);
  if (existingByUsername && existingByUsername.id !== userId) {
    throw new AppError('That username is already taken. Please choose another.', 409, 'DUPLICATE_USERNAME');
  }

  const existingByEmail = await userModel.findUserByEmail(cleanEmail);
  if (existingByEmail && existingByEmail.id !== userId) {
    throw new AppError('That email is already linked to another account.', 409, 'DUPLICATE_EMAIL');
  }

  const updated = await userModel.updateAccount(userId, { username: cleanUsername, email: cleanEmail });
  if (!updated) {
    throw new AppError('We could not update your account details. Please try again.', 500, 'UPDATE_FAILED');
  }
  return updated;
}

module.exports = { updateAccount, validateUsername, changePassword };

async function changePassword(userId, { currentPassword, newPassword, confirmNewPassword }) {
  if (!isNonEmptyString(currentPassword) || !isNonEmptyString(newPassword) || !isNonEmptyString(confirmNewPassword)) {
    throw new AppError('Please fill in all password fields.', 400, 'MISSING_FIELD');
  }
  if (newPassword !== confirmNewPassword) {
    throw new AppError('New passwords do not match.', 400, 'PASSWORD_MISMATCH');
  }
  validatePassword(newPassword);

  const userWithHash = await userModel.findUserByIdWithHash(userId);
  if (!userWithHash) {
    throw new AppError('We could not find your account. Please log in again.', 404, 'USER_NOT_FOUND');
  }

  const matches = await bcrypt.compare(currentPassword, userWithHash.password_hash);
  if (!matches) {
    throw new AppError('Your current password is incorrect.', 400, 'INVALID_CURRENT_PASSWORD');
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await userModel.updatePasswordHash(userId, newHash);
}
