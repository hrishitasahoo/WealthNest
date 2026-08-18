const budgetPlanModel = require('../models/budgetPlanModel');
const { round2 } = require('../utils/calculations');

function calculateAllocation({ monthlyIncome, recurringExpenses }) {
  const income = Number(monthlyIncome) || 0;

  const needsPercent = 50;
  const wantsPercent = 30;
  const savingsPercent = 20;

  const needsAmount = round2(income * 0.5);
  const wantsAmount = round2(income * 0.3);
  const savingsAmount = round2(income * 0.2);
  const recommendedTotalExpenses = round2(needsAmount + wantsAmount);

  let comparison = null;
  if (recurringExpenses !== null && recurringExpenses !== undefined && recurringExpenses !== '') {
    const actual = Number(recurringExpenses);
    const diff = round2(actual - recommendedTotalExpenses);
    if (diff > 0) {
      comparison = `Your recorded monthly expenses are ₹${diff.toLocaleString('en-IN')} above the recommended limit.`;
    } else {
      comparison = `Your recorded monthly expenses are within the recommended limit, with ₹${Math.abs(diff).toLocaleString('en-IN')} to spare.`;
    }
  }

  return {
    needsPercent, wantsPercent, savingsPercent,
    needsAmount, wantsAmount, savingsAmount,
    recommendedTotalExpenses,
    recommendedSavings: savingsAmount,
    comparison
  };
}

async function getPlan(userId) {
  const plan = await budgetPlanModel.getPlanByUserId(userId);
  if (!plan) return null;
  const allocation = calculateAllocation({
    monthlyIncome: plan.monthly_income,
    recurringExpenses: plan.recurring_expenses
  });
  return { ...plan, allocation };
}

async function savePlan(userId, fields) {
  const plan = await budgetPlanModel.upsertPlan(userId, fields);
  const allocation = calculateAllocation({
    monthlyIncome: plan.monthly_income,
    recurringExpenses: plan.recurring_expenses
  });
  return { ...plan, allocation };
}

module.exports = { getPlan, savePlan, calculateAllocation };
