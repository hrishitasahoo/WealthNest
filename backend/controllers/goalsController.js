const asyncHandler = require('../middleware/asyncHandler');
const goalModel = require('../models/goalModel');
const { AppError } = require('../utils/AppError');
const { validateRequired, toPositiveNumber } = require('../utils/validators');
const { round2 } = require('../utils/calculations');

function computeTargetDate(months) {
  const d = new Date();
  d.setMonth(d.getMonth() + Number(months));
  return d.toISOString().slice(0, 10);
}

const listGoals = asyncHandler(async (req, res) => {
  const goals = await goalModel.listGoals(req.userId);
  res.status(200).json({ success: true, data: { goals } });
});

const createGoal = asyncHandler(async (req, res) => {
  const { goalName, targetAmount, description, timeframeMonths } = req.body;

  validateRequired({ 'Goal name': goalName, 'Target amount': targetAmount, 'Time frame': timeframeMonths });
  toPositiveNumber(targetAmount, 'Target amount');
  const months = toPositiveNumber(timeframeMonths, 'Time frame');
  if (months < 1) {
    throw new AppError('Time frame must be at least 1 month.', 400, 'INVALID_TIMEFRAME');
  }

  const targetDate = computeTargetDate(months);
  const monthlyContribution = round2(Number(targetAmount) / months);

  const goal = await goalModel.createGoal(req.userId, {
    goalName: goalName.trim(),
    description: description ? description.trim() : null,
    goalType: 'Other',
    targetAmount: Number(targetAmount),
    currentAmount: 0,
    targetDate,
    monthlyContribution
  });

  res.status(201).json({ success: true, message: 'Goal created successfully.', data: { goal } });
});

const updateGoal = asyncHandler(async (req, res) => {
  const { goalName, targetAmount, description, timeframeMonths } = req.body;
  const updateData = { goalName, description, targetAmount: targetAmount ? Number(targetAmount) : undefined };

  if (timeframeMonths) {
    const months = toPositiveNumber(timeframeMonths, 'Time frame');
    if (months < 1) {
      throw new AppError('Time frame must be at least 1 month.', 400, 'INVALID_TIMEFRAME');
    }
    updateData.targetDate = computeTargetDate(months);

    const existing = await goalModel.getGoalById(req.userId, req.params.id);
    if (existing) {
      const amount = targetAmount ? Number(targetAmount) : Number(existing.target_amount);
      const remaining = Math.max(amount - Number(existing.current_amount), 0);
      updateData.monthlyContribution = round2(remaining / months);
    }
  }

  const goal = await goalModel.updateGoal(req.userId, req.params.id, updateData);
  if (!goal) {
    throw new AppError('That goal could not be found.', 404, 'GOAL_NOT_FOUND');
  }
  res.status(200).json({ success: true, message: 'Goal updated successfully.', data: { goal } });
});

const deleteGoal = asyncHandler(async (req, res) => {
  const deleted = await goalModel.deleteGoal(req.userId, req.params.id);
  if (!deleted) {
    throw new AppError('That goal could not be found.', 404, 'GOAL_NOT_FOUND');
  }
  res.status(200).json({ success: true, message: 'Goal deleted successfully.' });
});

module.exports = { listGoals, createGoal, updateGoal, deleteGoal };
