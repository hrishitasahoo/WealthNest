const profileModel = require('../models/profileModel');
const goalModel = require('../models/goalModel');
const budgetModel = require('../models/budgetModel');
const budgetPlanModel = require('../models/budgetPlanModel');
const { calculateAllocation } = require('./budgetPlanService');
const { pool } = require('../config/db');
const { round2 } = require('../utils/calculations');

const WANTS_CATEGORIES = ['Entertainment', 'Shopping', 'Travel', 'Personal'];

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

async function generateInsights(userId) {
  const insights = [];
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const totalDaysInMonth = daysInMonth(now);
  const daysRemaining = totalDaysInMonth - now.getDate();

  const profile = await profileModel.getProfileByUserId(userId);
  const goals = await goalModel.listGoals(userId);
  const activeGoals = goals.filter(g => g.status === 'active');
  const plan = await budgetPlanModel.getPlanByUserId(userId);
  const monthEntries = await budgetModel.listBudgetEntries(userId, { month: currentMonth });

  if (plan && Number(plan.monthly_income) > 0) {
    const allocation = calculateAllocation({ monthlyIncome: plan.monthly_income });
    const wantsAmount = allocation.wantsAmount;
    const wantsSpent = monthEntries
      .filter(e => WANTS_CATEGORIES.includes(e.category))
      .reduce((sum, e) => sum + Number(e.amount), 0);

    if (wantsAmount > 0) {
      const usedPercent = (wantsSpent / wantsAmount) * 100;
      if (usedPercent >= 75 && daysRemaining > 2) {
        insights.push({
          type: 'warning',
          priority: 1,
          key: 'wants-pace',
          message: `You have used ${round2(usedPercent)}% of your Wants budget with ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining in the month.`
        });
      }
    }

    const totalBudget = allocation.recommendedTotalExpenses;
    const totalSpent = monthEntries.reduce((sum, e) => sum + Number(e.amount), 0);
    if (totalBudget > 0) {
      const overallPercent = (totalSpent / totalBudget) * 100;
      if (overallPercent >= 90 && daysRemaining > 3) {
        insights.push({
          type: 'warning',
          priority: 1,
          key: 'overall-pace',
          message: `You have used ${round2(overallPercent)}% of your monthly budget with ${daysRemaining} days remaining. Reviewing upcoming expenses may help you stay on track.`
        });
      }
    }
  }

  activeGoals.forEach(goal => {
    const target = Number(goal.target_amount);
    const current = Number(goal.current_amount);
    const remaining = Math.max(target - current, 0);
    const targetDate = new Date(goal.target_date);
    const daysToTarget = Math.round((targetDate - now) / (1000 * 60 * 60 * 24));

    if (remaining > 0 && daysToTarget > 0 && daysToTarget <= 42) {
      const weeksToTarget = Math.max(Math.round(daysToTarget / 7), 1);
      const monthsRemaining = Math.max(daysToTarget / 30, 0.5);
      const requiredMonthly = remaining / monthsRemaining;
      const currentContribution = Number(goal.monthly_contribution || 0);

      if (currentContribution < requiredMonthly) {
        insights.push({
          type: 'warning',
          priority: 2,
          key: `goal-upcoming-${goal.id}`,
          message: `Your "${goal.goal_name}" goal is ${weeksToTarget} week${weeksToTarget === 1 ? '' : 's'} away. Your current monthly contribution may need to increase to stay on schedule.`
        });
      } else {
        insights.push({
          type: 'info',
          priority: 3,
          key: `goal-upcoming-ontrack-${goal.id}`,
          message: `Your "${goal.goal_name}" goal is ${weeksToTarget} week${weeksToTarget === 1 ? '' : 's'} away and on track based on your current contribution.`
        });
      }
    } else if (remaining > 0) {
      insights.push({
        type: 'info',
        priority: 5,
        key: `goal-remaining-${goal.id}`,
        message: `You have ₹${round2(remaining).toLocaleString('en-IN')} remaining to reach your "${goal.goal_name}" goal.`
      });
    }
  });

  const categoryAverages = await budgetModel.getCategoryAverages(userId, 3);
  const currentByCategory = {};
  monthEntries.forEach(e => {
    currentByCategory[e.category] = (currentByCategory[e.category] || 0) + Number(e.amount);
  });

  categoryAverages.forEach(({ category, avgTotal }) => {
    const current = currentByCategory[category] || 0;
    if (avgTotal > 0 && current > 0) {
      const diffPercent = ((current - avgTotal) / avgTotal) * 100;
      if (diffPercent >= 20) {
        insights.push({
          type: 'warning',
          priority: 3,
          key: `spend-pattern-${category}`,
          message: `Your ${category.toLowerCase()} spending this month is ${round2(diffPercent)}% higher than your average over the previous three months.`
        });
      }
    }
  });

  for (const goal of activeGoals) {
    const [rows] = await pool.query(
      `SELECT DAY(entry_date) AS day_of_month, entry_date FROM savings_entries
       WHERE user_id = ? AND goal_id = ? ORDER BY entry_date DESC LIMIT 6`,
      [userId, goal.id]
    );
    if (rows.length >= 2) {
      const days = rows.map(r => r.day_of_month).sort((a, b) => a - b);
      const medianDay = days[Math.floor(days.length / 2)];

      const thisMonthEntry = rows.find(r => {
        const d = new Date(r.entry_date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      });

      if (!thisMonthEntry && now.getDate() >= medianDay && Number(goal.monthly_contribution) > 0) {
        insights.push({
          type: 'info',
          priority: 2,
          key: `recurring-${goal.id}`,
          message: `Your ₹${round2(Number(goal.monthly_contribution)).toLocaleString('en-IN')} contribution toward "${goal.goal_name}" is usually recorded around day ${medianDay} of the month. It looks like this month's entry may still be due.`
        });
      }
    }
  }

  activeGoals.forEach(goal => {
    const target = Number(goal.target_amount);
    const current = Number(goal.current_amount);
    if (target <= 0) return;
    const progressPercent = (current / target) * 100;
    const milestones = [25, 50, 75, 100];
    const reached = milestones.filter(m => progressPercent >= m).pop();
    if (reached) {
      insights.push({
        type: 'positive',
        priority: 4,
        key: `milestone-${goal.id}-${reached}`,
        message: `Your "${goal.goal_name}" goal is now ${reached}% complete.`
      });
    }
  });

  if (profile && Number(profile.monthly_income) > 0) {
    const income = Number(profile.monthly_income);
    const expenses = Number(profile.monthly_expenses || 0);
    const savingsRate = ((income - expenses) / income) * 100;

    if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        priority: 1,
        key: 'low-savings-rate',
        message: 'You are currently saving a small portion of your monthly income. Reviewing recurring expenses may help increase your savings.'
      });
    } else if (savingsRate >= 30) {
      insights.push({
        type: 'positive',
        priority: 5,
        key: 'strong-savings-rate',
        message: `You are saving around ${round2(savingsRate)}% of your monthly income, which is a strong savings rate.`
      });
    }
  } else if (!plan) {
    insights.push({
      type: 'info',
      priority: 6,
      key: 'no-plan-yet',
      message: 'Set up your Budget Plan to start receiving spending pace and budget insights.'
    });
  }

  if (activeGoals.length === 0) {
    insights.push({
      type: 'info',
      priority: 6,
      key: 'no-goals',
      message: 'You have not set any financial goals yet. Creating a goal can help you save with purpose.'
    });
  }

  const seen = new Set();
  const sorted = insights
    .sort((a, b) => a.priority - b.priority)
    .filter(i => {
      if (seen.has(i.key)) return false;
      seen.add(i.key);
      return true;
    });

  if (sorted.length === 0) {
    sorted.push({
      type: 'info',
      priority: 7,
      key: 'getting-started',
      message: 'Add your income and expenses in Settings, create a goal, and record a few expenses — WealthNest will start showing personalized insights here based on that data.'
    });
  }

  return sorted;
}

module.exports = { generateInsights };
