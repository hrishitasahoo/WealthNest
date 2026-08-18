const asyncHandler = require('../middleware/asyncHandler');
const { AppError } = require('../utils/AppError');
const { validateRequired, toPositiveNumber } = require('../utils/validators');
const {
  calculateSIP,
  calculateFD,
  calculateCompoundInterest,
  calculateSavingsGoal,
  buildSIPGrowthSeries,
  buildCompoundGrowthSeries
} = require('../utils/calculations');

const sip = asyncHandler(async (req, res) => {
  const { monthlyInvestment, annualReturnPercent, years } = req.body;
  validateRequired({ 'Monthly investment': monthlyInvestment, 'Expected annual return': annualReturnPercent, 'Duration': years });
  toPositiveNumber(monthlyInvestment, 'Monthly investment');
  toPositiveNumber(annualReturnPercent, 'Expected annual return');
  toPositiveNumber(years, 'Duration');

  const result = calculateSIP({ monthlyInvestment, annualReturnPercent, years });
  const growthSeries = buildSIPGrowthSeries({ monthlyInvestment, annualReturnPercent, years: Number(years) });

  res.status(200).json({
    success: true,
    data: {
      ...result,
      growthSeries,
      disclaimer: 'This result is an estimate based on the values entered and does not guarantee actual investment returns.'
    }
  });
});

const fd = asyncHandler(async (req, res) => {
  const { principal, annualRatePercent, years, compoundingPerYear } = req.body;
  validateRequired({ 'Principal amount': principal, 'Interest rate': annualRatePercent, Tenure: years });
  toPositiveNumber(principal, 'Principal amount');
  toPositiveNumber(annualRatePercent, 'Interest rate');
  toPositiveNumber(years, 'Tenure');

  const freq = Number(compoundingPerYear) || 4;
  const result = calculateFD({ principal, annualRatePercent, years, compoundingPerYear: freq });

  res.status(200).json({ success: true, data: result });
});

const compoundInterest = asyncHandler(async (req, res) => {
  const { principal, annualRatePercent, years, compoundingPerYear } = req.body;
  validateRequired({ Principal: principal, 'Annual interest rate': annualRatePercent, 'Time period': years });
  toPositiveNumber(principal, 'Principal');
  toPositiveNumber(annualRatePercent, 'Annual interest rate');
  toPositiveNumber(years, 'Time period');

  const freq = Number(compoundingPerYear) || 1;
  const result = calculateCompoundInterest({ principal, annualRatePercent, years, compoundingPerYear: freq });
  const growthSeries = buildCompoundGrowthSeries({ principal, annualRatePercent, years: Number(years), compoundingPerYear: freq });

  res.status(200).json({ success: true, data: { ...result, growthSeries } });
});

const savingsGoal = asyncHandler(async (req, res) => {
  const { targetAmount, currentSavings, targetDate, monthlyContribution } = req.body;
  validateRequired({ 'Target amount': targetAmount, 'Target date': targetDate });
  toPositiveNumber(targetAmount, 'Target amount');

  if (!targetDate || Number.isNaN(new Date(targetDate).getTime())) {
    throw new AppError('Please enter a valid target date.', 400, 'INVALID_DATE');
  }

  const result = calculateSavingsGoal({
    targetAmount,
    currentSavings: currentSavings || 0,
    targetDate,
    monthlyContribution: monthlyContribution || 0
  });

  res.status(200).json({ success: true, data: result });
});

module.exports = { sip, fd, compoundInterest, savingsGoal };
