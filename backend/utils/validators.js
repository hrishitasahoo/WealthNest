const { AppError } = require('./AppError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateEmail(email) {
  if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email.trim())) {
    throw new AppError('Please enter a valid email address.', 400, 'INVALID_EMAIL');
  }
}

function validatePassword(password) {
  if (!isNonEmptyString(password) || password.length < 8) {
    throw new AppError('Password must be at least 8 characters long.', 400, 'INVALID_PASSWORD');
  }
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    throw new AppError('Password must contain both letters and numbers.', 400, 'WEAK_PASSWORD');
  }
}

function validateRequired(fields) {
  for (const [label, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') {
      throw new AppError(`${label} is required.`, 400, 'MISSING_FIELD');
    }
  }
}

function toPositiveNumber(value, label) {
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) {
    throw new AppError(`${label} must be a valid positive number.`, 400, 'INVALID_NUMBER');
  }
  return num;
}

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

module.exports = {
  isNonEmptyString,
  validateEmail,
  validatePassword,
  validateRequired,
  toPositiveNumber,
  toNumberOrNull
};
