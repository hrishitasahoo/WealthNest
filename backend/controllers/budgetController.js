const asyncHandler = require('../middleware/asyncHandler');
const budgetModel = require('../models/budgetModel');
const { AppError } = require('../utils/AppError');
const { validateRequired, toPositiveNumber } = require('../utils/validators');
const { round2 } = require('../utils/calculations');

const CATEGORIES = [
  'Food', 'Groceries', 'Rent', 'Utilities', 'Transport', 'Education', 'Healthcare',
  'Shopping', 'Entertainment', 'Bills', 'Family', 'Travel', 'Personal', 'Other'
];
const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Other'];

const listBudgetEntries = asyncHandler(async (req, res) => {
  const { category, month, search } = req.query;
  const entries = await budgetModel.listBudgetEntries(req.userId, { category, month, search });

  const totalSpent = entries.reduce((sum, e) => sum + Number(e.amount), 0);
  const byCategory = {};
  entries.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
  });

  res.status(200).json({
    success: true,
    data: { entries, totalSpent: round2(totalSpent), byCategory, categories: CATEGORIES, paymentMethods: PAYMENT_METHODS }
  });
});

const getExpenseSummary = asyncHandler(async (req, res) => {
  const budgetPlanModel = require('../models/budgetPlanModel');
  const { calculateAllocation } = require('../services/budgetPlanService');
  const currentMonth = new Date().toISOString().slice(0, 7);
  const entries = await budgetModel.listBudgetEntries(req.userId, { month: currentMonth });

  const totalSpent = round2(entries.reduce((sum, e) => sum + Number(e.amount), 0));

  const byCategory = {};
  entries.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount); });
  let largestCategory = null;
  let largestAmount = 0;
  Object.entries(byCategory).forEach(([cat, amt]) => {
    if (amt > largestAmount) { largestCategory = cat; largestAmount = amt; }
  });

  const now = new Date();
  const dayOfMonth = now.getDate();
  const dailyAverage = dayOfMonth > 0 ? round2(totalSpent / dayOfMonth) : 0;

  const plan = await budgetPlanModel.getPlanByUserId(req.userId);
  let remainingBudget = null;
  if (plan) {
    const allocation = calculateAllocation({ monthlyIncome: plan.monthly_income });
    remainingBudget = round2(allocation.recommendedTotalExpenses - totalSpent);
  }

  res.status(200).json({
    success: true,
    data: {
      currentMonth,
      totalSpent,
      largestCategory: largestCategory ? { category: largestCategory, amount: round2(largestAmount) } : null,
      dailyAverage,
      remainingBudget,
      byCategory
    }
  });
});

const createBudgetEntry = asyncHandler(async (req, res) => {
  const { category, amount, paymentMethod, description, note, entryDate } = req.body;
  validateRequired({ Category: category, Amount: amount, Date: entryDate });
  toPositiveNumber(amount, 'Amount');

  if (!CATEGORIES.includes(category)) {
    throw new AppError('Please choose a valid expense category.', 400, 'INVALID_CATEGORY');
  }
  if (paymentMethod && !PAYMENT_METHODS.includes(paymentMethod)) {
    throw new AppError('Please choose a valid payment method.', 400, 'INVALID_PAYMENT_METHOD');
  }

  const entry = await budgetModel.createBudgetEntry(req.userId, {
    category, amount: Number(amount), paymentMethod, description, note, entryDate
  });

  res.status(201).json({ success: true, message: 'Expense added successfully.', data: { entry } });
});

const updateBudgetEntry = asyncHandler(async (req, res) => {
  const entry = await budgetModel.updateBudgetEntry(req.userId, req.params.id, req.body);
  if (!entry) {
    throw new AppError('That expense entry could not be found.', 404, 'ENTRY_NOT_FOUND');
  }
  res.status(200).json({ success: true, message: 'Expense updated successfully.', data: { entry } });
});

const deleteBudgetEntry = asyncHandler(async (req, res) => {
  const deleted = await budgetModel.deleteBudgetEntry(req.userId, req.params.id);
  if (!deleted) {
    throw new AppError('That expense entry could not be found.', 404, 'ENTRY_NOT_FOUND');
  }
  res.status(200).json({ success: true, message: 'Expense deleted successfully.' });
});

module.exports = { listBudgetEntries, getExpenseSummary, createBudgetEntry, updateBudgetEntry, deleteBudgetEntry };
