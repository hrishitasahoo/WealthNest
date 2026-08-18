const asyncHandler = require('../middleware/asyncHandler');
const budgetPlanService = require('../services/budgetPlanService');
const { AppError } = require('../utils/AppError');
const { toNumberOrNull } = require('../utils/validators');

const getPlan = asyncHandler(async (req, res) => {
  const plan = await budgetPlanService.getPlan(req.userId);
  res.status(200).json({ success: true, data: { plan } });
});

const savePlan = asyncHandler(async (req, res) => {
  const { monthlyIncome, recurringExpenses } = req.body;
  const income = toNumberOrNull(monthlyIncome);

  if (income === null || income <= 0) {
    throw new AppError('Please enter your monthly income.', 400, 'INVALID_INCOME');
  }

  const plan = await budgetPlanService.savePlan(req.userId, {
    monthlyIncome: income,
    recurringExpenses: toNumberOrNull(recurringExpenses)
  });

  res.status(200).json({
    success: true,
    message: 'Your budget plan has been saved.',
    data: { plan }
  });
});

module.exports = { getPlan, savePlan };
