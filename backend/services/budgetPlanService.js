const budgetPlanModel = require('../models/budgetPlanModel');
const budgetModel = require('../models/budgetModel');
const { round2 } = require('../utils/calculations');

const NEEDS_CATEGORIES = ['Food', 'Groceries', 'Rent', 'Utilities', 'Transport', 'Education', 'Healthcare', 'Bills', 'Family'];
const WANTS_CATEGORIES = ['Shopping', 'Entertainment', 'Travel', 'Personal', 'Other'];

function getIncomeBracket(income) {
  if (income < 15000) return { needsPercent: 65, wantsPercent: 15, savingsPercent: 20 };
  if (income < 30000) return { needsPercent: 55, wantsPercent: 25, savingsPercent: 20 };
  if (income < 60000) return { needsPercent: 50, wantsPercent: 30, savingsPercent: 20 };
  if (income < 100000) return { needsPercent: 45, wantsPercent: 30, savingsPercent: 25 };
  return { needsPercent: 40, wantsPercent: 25, savingsPercent: 35 };
}

function calculateAllocation({ monthlyIncome, actualNeedsSpent = 0, actualWantsSpent = 0 }) {
  const income = Number(monthlyIncome) || 0;
  const { needsPercent, wantsPercent, savingsPercent } = getIncomeBracket(income);

  const needsAmount = round2(income * (needsPercent / 100));
  const wantsAmount = round2(income * (wantsPercent / 100));
  const savingsAmount = round2(income * (savingsPercent / 100));
  const recommendedTotalExpenses = round2(needsAmount + wantsAmount);

  const needsDiff = round2(actualNeedsSpent - needsAmount);
  const wantsDiff = round2(actualWantsSpent - wantsAmount);

  return {
    needsPercent, wantsPercent, savingsPercent,
    needsAmount, wantsAmount, savingsAmount,
    recommendedTotalExpenses,
    recommendedSavings: savingsAmount,
    actualNeedsSpent: round2(actualNeedsSpent),
    actualWantsSpent: round2(actualWantsSpent),
    needsDiff,
    wantsDiff
  };
}

async function getActualSpendSplit(userId) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const entries = await budgetModel.listBudgetEntries(userId, { month: currentMonth });

  let actualNeedsSpent = 0;
  let actualWantsSpent = 0;
  entries.forEach(e => {
    const amount = Number(e.amount);
    if (NEEDS_CATEGORIES.includes(e.category)) actualNeedsSpent += amount;
    else if (WANTS_CATEGORIES.includes(e.category)) actualWantsSpent += amount;
  });

  return { actualNeedsSpent, actualWantsSpent };
}

async function getPlan(userId) {
  const plan = await budgetPlanModel.getPlanByUserId(userId);
  if (!plan) return null;

  const { actualNeedsSpent, actualWantsSpent } = await getActualSpendSplit(userId);
  const allocation = calculateAllocation({
    monthlyIncome: plan.monthly_income,
    actualNeedsSpent,
    actualWantsSpent
  });
  return { ...plan, allocation };
}

async function savePlan(userId, fields) {
  const plan = await budgetPlanModel.upsertPlan(userId, fields);
  const { actualNeedsSpent, actualWantsSpent } = await getActualSpendSplit(userId);
  const allocation = calculateAllocation({
    monthlyIncome: plan.monthly_income,
    actualNeedsSpent,
    actualWantsSpent
  });
  return { ...plan, allocation };
}

module.exports = { getPlan, savePlan, calculateAllocation, NEEDS_CATEGORIES, WANTS_CATEGORIES };
