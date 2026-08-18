const asyncHandler = require('../middleware/asyncHandler');
const accountService = require('../services/accountService');

const updateAccount = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const user = await accountService.updateAccount(req.userId, { username, email });

  res.status(200).json({
    success: true,
    message: 'Your account details have been updated.',
    data: { user }
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  await accountService.changePassword(req.userId, { currentPassword, newPassword, confirmNewPassword });

  res.status(200).json({
    success: true,
    message: 'Your password has been updated.'
  });
});

module.exports = { updateAccount, changePassword };
