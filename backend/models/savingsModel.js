const { pool } = require('../config/db');

async function listSavingsEntries(userId, { goalId, range } = {}) {
  let query = `SELECT s.id, s.user_id, s.goal_id, s.amount, s.entry_date, s.description,
                      s.created_at, s.updated_at, g.goal_name
               FROM savings_entries s
               LEFT JOIN financial_goals g ON g.id = s.goal_id
               WHERE s.user_id = ?`;
  const params = [userId];

  if (goalId) {
    query += ` AND s.goal_id = ?`;
    params.push(goalId);
  }

  if (range === 'weekly') {
    query += ` AND s.entry_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`;
  } else if (range === 'monthly') {
    query += ` AND s.entry_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
  } else if (range === 'yearly') {
    query += ` AND s.entry_date >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)`;
  }

  query += ` ORDER BY s.entry_date DESC, s.id DESC`;
  const [rows] = await pool.query(query, params);
  return rows;
}

async function getSavingsEntryById(userId, id) {
  const [rows] = await pool.query(
    `SELECT id, user_id, goal_id, amount, entry_date, description, created_at, updated_at
     FROM savings_entries WHERE id = ? AND user_id = ? LIMIT 1`,
    [id, userId]
  );
  return rows[0] || null;
}

async function createSavingsEntry(userId, data) {
  const [result] = await pool.query(
    `INSERT INTO savings_entries (user_id, goal_id, amount, entry_date, description)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, data.goalId || null, data.amount, data.entryDate, data.description || null]
  );

  if (data.goalId) {
    await pool.query(
      `UPDATE financial_goals SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?`,
      [data.amount, data.goalId, userId]
    );
  }

  return getSavingsEntryById(userId, result.insertId);
}

async function updateSavingsEntry(userId, id, data) {
  const existing = await getSavingsEntryById(userId, id);
  if (!existing) return null;

  if (existing.goal_id) {
    await pool.query(
      `UPDATE financial_goals SET current_amount = current_amount - ? WHERE id = ? AND user_id = ?`,
      [existing.amount, existing.goal_id, userId]
    );
  }

  const newGoalId = data.goalId !== undefined ? data.goalId : existing.goal_id;
  const newAmount = data.amount !== undefined ? data.amount : existing.amount;

  await pool.query(
    `UPDATE savings_entries SET goal_id = ?, amount = ?, entry_date = ?, description = ?
     WHERE id = ? AND user_id = ?`,
    [
      newGoalId || null,
      newAmount,
      data.entryDate ?? existing.entry_date,
      data.description ?? existing.description,
      id,
      userId
    ]
  );

  if (newGoalId) {
    await pool.query(
      `UPDATE financial_goals SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?`,
      [newAmount, newGoalId, userId]
    );
  }

  return getSavingsEntryById(userId, id);
}

async function deleteSavingsEntry(userId, id) {
  const existing = await getSavingsEntryById(userId, id);
  if (!existing) return false;

  if (existing.goal_id) {
    await pool.query(
      `UPDATE financial_goals SET current_amount = current_amount - ? WHERE id = ? AND user_id = ?`,
      [existing.amount, existing.goal_id, userId]
    );
  }

  const [result] = await pool.query(
    `DELETE FROM savings_entries WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result.affectedRows > 0;
}

async function getTotalSavings(userId) {
  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM savings_entries WHERE user_id = ?`,
    [userId]
  );
  return Number(rows[0].total);
}

async function getSavingsSeries(userId, range) {
  let interval = '30 DAY';
  let format = '%Y-%m-%d';
  if (range === 'weekly') { interval = '7 DAY'; format = '%Y-%m-%d'; }
  else if (range === 'yearly') { interval = '365 DAY'; format = '%Y-%m'; }

  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(entry_date, ?) AS period, SUM(amount) AS total
     FROM savings_entries
     WHERE user_id = ? AND entry_date >= DATE_SUB(CURDATE(), INTERVAL ${interval})
     GROUP BY period ORDER BY period ASC`,
    [format, userId]
  );
  return rows.map(r => ({ period: r.period, total: Number(r.total) }));
}

module.exports = {
  listSavingsEntries,
  getSavingsEntryById,
  createSavingsEntry,
  updateSavingsEntry,
  deleteSavingsEntry,
  getTotalSavings,
  getSavingsSeries
};
