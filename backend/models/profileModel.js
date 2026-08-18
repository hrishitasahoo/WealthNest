const { pool } = require('../config/db');

async function getProfileByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT id, user_id, age, monthly_income, monthly_expenses, current_savings,
            existing_investments, monthly_saving_capacity, main_financial_goal,
            created_at, updated_at
     FROM financial_profiles WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function upsertProfile(userId, fields) {
  const existing = await getProfileByUserId(userId);

  const {
    age = null,
    monthlyIncome = null,
    monthlyExpenses = null,
    currentSavings = null,
    existingInvestments = null,
    monthlySavingCapacity = null,
    mainFinancialGoal = null
  } = fields;

  if (existing) {
    await pool.query(
      `UPDATE financial_profiles SET
        age = ?, monthly_income = ?, monthly_expenses = ?, current_savings = ?,
        existing_investments = ?, monthly_saving_capacity = ?, main_financial_goal = ?
       WHERE user_id = ?`,
      [age, monthlyIncome, monthlyExpenses, currentSavings, existingInvestments,
        monthlySavingCapacity, mainFinancialGoal, userId]
    );
  } else {
    await pool.query(
      `INSERT INTO financial_profiles
        (user_id, age, monthly_income, monthly_expenses, current_savings,
         existing_investments, monthly_saving_capacity, main_financial_goal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, age, monthlyIncome, monthlyExpenses, currentSavings, existingInvestments,
        monthlySavingCapacity, mainFinancialGoal]
    );
  }

  return getProfileByUserId(userId);
}

module.exports = { getProfileByUserId, upsertProfile };
