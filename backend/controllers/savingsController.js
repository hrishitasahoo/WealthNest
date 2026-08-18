const asyncHandler = require('../middleware/asyncHandler');
const savingsModel = require('../models/savingsModel');
const { AppError } = require('../utils/AppError');
const { validateRequired, toPositiveNumber } = require('../utils/validators');

const listSavingsEntries = asyncHandler(async (req, res) => {
  const { goalId, range } = req.query;
  const entries = await savingsModel.listSavingsEntries(req.userId, { goalId, range });
  const totalSavings = await savingsModel.getTotalSavings(req.userId);
  const series = await savingsModel.getSavingsSeries(req.userId, range || 'monthly');

  res.status(200).json({
    success: true,
    data: { entries, totalSavings, series }
  });
});

const createSavingsEntry = asyncHandler(async (req, res) => {
  const { amount, entryDate, description, goalId } = req.body;
  validateRequired({ Amount: amount, Date: entryDate });
  toPositiveNumber(amount, 'Amount');

  const entry = await savingsModel.createSavingsEntry(req.userId, {
    amount: Number(amount), entryDate, description, goalId: goalId || null
  });

  res.status(201).json({ success: true, message: 'Savings entry added successfully.', data: { entry } });
});

const updateSavingsEntry = asyncHandler(async (req, res) => {
  const entry = await savingsModel.updateSavingsEntry(req.userId, req.params.id, req.body);
  if (!entry) {
    throw new AppError('That savings entry could not be found.', 404, 'ENTRY_NOT_FOUND');
  }
  res.status(200).json({ success: true, message: 'Savings entry updated successfully.', data: { entry } });
});

const deleteSavingsEntry = asyncHandler(async (req, res) => {
  const deleted = await savingsModel.deleteSavingsEntry(req.userId, req.params.id);
  if (!deleted) {
    throw new AppError('That savings entry could not be found.', 404, 'ENTRY_NOT_FOUND');
  }
  res.status(200).json({ success: true, message: 'Savings entry deleted successfully.' });
});

module.exports = { listSavingsEntries, createSavingsEntry, updateSavingsEntry, deleteSavingsEntry };
