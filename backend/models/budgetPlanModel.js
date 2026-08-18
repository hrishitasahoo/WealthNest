const { pool } = require('../config/db');

async function getPlanByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT id, user_id, monthly_income, recurring_expenses, created_at, updated_at
     FROM budget_plans WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function upsertPlan(userId, fields) {
  const existing = await getPlanByUserId(userId);
  const monthlyIncome = Number(fields.monthlyIncome) || 0;
  const recurringExpenses = fields.recurringExpenses === null || fields.recurringExpenses === undefined
    ? null
    : Number(fields.recurringExpenses);

  if (existing) {
    await pool.query(
      `UPDATE budget_plans SET monthly_income = ?, recurring_expenses = ? WHERE user_id = ?`,
      [monthlyIncome, recurringExpenses, userId]
    );
  } else {
    await pool.query(
      `INSERT INTO budget_plans (user_id, monthly_income, recurring_expenses) VALUES (?, ?, ?)`,
      [userId, monthlyIncome, recurringExpenses]
    );
  }

  return getPlanByUserId(userId);
}

module.exports = { getPlanByUserId, upsertPlan };
