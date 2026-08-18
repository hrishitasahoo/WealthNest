const asyncHandler = require('../middleware/asyncHandler');
const profileModel = require('../models/profileModel');
const { toNumberOrNull } = require('../utils/validators');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileModel.getProfileByUserId(req.userId);
  res.status(200).json({ success: true, data: { profile } });
});

const updateProfile = asyncHandler(async (req, res) => {
  const {
    age, monthlyIncome, monthlyExpenses, currentSavings,
    existingInvestments, monthlySavingCapacity, mainFinancialGoal
  } = req.body;

  const profile = await profileModel.upsertProfile(req.userId, {
    age: toNumberOrNull(age),
    monthlyIncome: toNumberOrNull(monthlyIncome),
    monthlyExpenses: toNumberOrNull(monthlyExpenses),
    currentSavings: toNumberOrNull(currentSavings),
    existingInvestments: toNumberOrNull(existingInvestments),
    monthlySavingCapacity: toNumberOrNull(monthlySavingCapacity),
    mainFinancialGoal: mainFinancialGoal || null
  });

  res.status(200).json({
    success: true,
    message: 'Your financial profile has been updated.',
    data: { profile }
  });
});

module.exports = { getProfile, updateProfile };
