const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');
const userModel = require('../models/userModel');

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword, preferredLanguage } = req.body;
  const { user, token } = await authService.register({ fullName, email, password, confirmPassword, preferredLanguage });

  res.cookie('wn_token', token, COOKIE_OPTIONS);
  res.status(201).json({
    success: true,
    message: 'Your WealthNest account has been created.',
    data: { user, token }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });

  res.cookie('wn_token', token, COOKIE_OPTIONS);
  res.status(200).json({
    success: true,
    message: 'Welcome back!',
    data: { user, token }
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('wn_token');
  res.status(200).json({ success: true, message: 'You have been logged out.' });
});

const me = asyncHandler(async (req, res) => {
  const user = await userModel.findUserById(req.userId);
  res.status(200).json({ success: true, data: { user } });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const baseUrl = process.env.CLIENT_ORIGIN || `${req.protocol}://${req.get('host')}`;
  const { message } = await authService.requestPasswordReset(email, baseUrl);
  res.status(200).json({ success: true, message });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;
  const { message } = await authService.resetPassword({ token, newPassword, confirmNewPassword });
  res.status(200).json({ success: true, message });
});

module.exports = { register, login, logout, me, forgotPassword, resetPassword };
