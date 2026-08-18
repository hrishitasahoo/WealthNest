const profileModel = require('../models/profileModel');
const goalModel = require('../models/goalModel');
const budgetModel = require('../models/budgetModel');
const budgetPlanModel = require('../models/budgetPlanModel');
const { calculateAllocation } = require('./budgetPlanService');
const savingsModel = require('../models/savingsModel');
const { round2 } = require('../utils/calculations');

async function getDashboardSummary(userId) {
  const profile = await profileModel.getProfileByUserId(userId);

  const monthlyIncome = Number(profile?.monthly_income || 0);
  const monthlyExpenses = Number(profile?.monthly_expenses || 0);
  const monthlySavings = round2(monthlyIncome - monthlyExpenses);
  const savingsRate = monthlyIncome > 0 ? round2((monthlySavings / monthlyIncome) * 100) : 0;

  const goals = await goalModel.listGoals(userId);
  const activeGoals = goals.filter(g => g.status === 'active');

  const currentMonth = new Date().toISOString().slice(0, 7);
  const budgetEntries = await budgetModel.listBudgetEntries(userId, { month: currentMonth });
  const totalBudgetSpent = round2(budgetEntries.reduce((sum, e) => sum + Number(e.amount), 0));

  const totalSavings = await savingsModel.getTotalSavings(userId);

  const plan = await budgetPlanModel.getPlanByUserId(userId);
  let budgetProgress = null;
  if (plan) {
    const allocation = calculateAllocation({ monthlyIncome: plan.monthly_income });
    const totalBudget = allocation.recommendedTotalExpenses;
    budgetProgress = {
      totalBudget,
      spent: totalBudgetSpent,
      remaining: round2(totalBudget - totalBudgetSpent),
      percentUsed: totalBudget > 0 ? round2((totalBudgetSpent / totalBudget) * 100) : 0
    };
  }

  const availableThisMonth = round2(monthlyIncome - totalBudgetSpent);

  return {
    profileComplete: !!profile,
    financialSummary: {
      monthlyIncome: round2(monthlyIncome),
      monthlyExpenses: round2(monthlyExpenses),
      monthlySavings,
      savingsRate,
      availableThisMonth
    },
    expenseSummary: {
      currentMonth,
      totalSpent: totalBudgetSpent
    },
    budgetProgress,
    goalsSummary: {
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      goals: activeGoals.slice(0, 4)
    },
    savingsSummary: {
      totalSavings: round2(totalSavings)
    }
  };
}

module.exports = { getDashboardSummary };
