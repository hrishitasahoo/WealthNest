const { pool } = require('../config/db');

async function listGoals(userId) {
  const [rows] = await pool.query(
    `SELECT id, user_id, goal_name, description, goal_type, target_amount, current_amount,
            target_date, monthly_contribution, status, created_at, updated_at
     FROM financial_goals WHERE user_id = ? ORDER BY status = 'active' DESC, target_date ASC`,
    [userId]
  );
  return rows;
}

async function getGoalById(userId, goalId) {
  const [rows] = await pool.query(
    `SELECT id, user_id, goal_name, description, goal_type, target_amount, current_amount,
            target_date, monthly_contribution, status, created_at, updated_at
     FROM financial_goals WHERE id = ? AND user_id = ? LIMIT 1`,
    [goalId, userId]
  );
  return rows[0] || null;
}

async function createGoal(userId, data) {
  const [result] = await pool.query(
    `INSERT INTO financial_goals
      (user_id, goal_name, description, goal_type, target_amount, current_amount, target_date, monthly_contribution)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, data.goalName, data.description || null, data.goalType || 'Other', data.targetAmount,
      data.currentAmount || 0, data.targetDate, data.monthlyContribution || 0]
  );
  return getGoalById(userId, result.insertId);
}

async function updateGoal(userId, goalId, data) {
  const existing = await getGoalById(userId, goalId);
  if (!existing) return null;

  await pool.query(
    `UPDATE financial_goals SET
      goal_name = ?, description = ?, goal_type = ?, target_amount = ?, current_amount = ?,
      target_date = ?, monthly_contribution = ?, status = ?
     WHERE id = ? AND user_id = ?`,
    [
      data.goalName ?? existing.goal_name,
      data.description !== undefined ? data.description : existing.description,
      data.goalType ?? existing.goal_type,
      data.targetAmount ?? existing.target_amount,
      data.currentAmount ?? existing.current_amount,
      data.targetDate ?? existing.target_date,
      data.monthlyContribution ?? existing.monthly_contribution,
      data.status ?? existing.status,
      goalId,
      userId
    ]
  );
  return getGoalById(userId, goalId);
}

async function deleteGoal(userId, goalId) {
  const [result] = await pool.query(
    `DELETE FROM financial_goals WHERE id = ? AND user_id = ?`,
    [goalId, userId]
  );
  return result.affectedRows > 0;
}

module.exports = { listGoals, getGoalById, createGoal, updateGoal, deleteGoal };
