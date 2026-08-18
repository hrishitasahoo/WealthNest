const { pool } = require('../config/db');

async function listBudgetEntries(userId, { category, month, search } = {}) {
  let query = `SELECT id, user_id, category, amount, payment_method, description, note, entry_date, created_at, updated_at
               FROM budget_entries WHERE user_id = ?`;
  const params = [userId];

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }
  if (month) {
    query += ` AND DATE_FORMAT(entry_date, '%Y-%m') = ?`;
    params.push(month);
  }
  if (search) {
    query += ` AND (description LIKE ? OR note LIKE ? OR category LIKE ?)`;
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  query += ` ORDER BY entry_date DESC, id DESC`;
  const [rows] = await pool.query(query, params);
  return rows;
}

async function getBudgetEntryById(userId, id) {
  const [rows] = await pool.query(
    `SELECT id, user_id, category, amount, payment_method, description, note, entry_date, created_at, updated_at
     FROM budget_entries WHERE id = ? AND user_id = ? LIMIT 1`,
    [id, userId]
  );
  return rows[0] || null;
}

async function createBudgetEntry(userId, data) {
  const [result] = await pool.query(
    `INSERT INTO budget_entries (user_id, category, amount, payment_method, description, note, entry_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, data.category, data.amount, data.paymentMethod || null, data.description || null, data.note || null, data.entryDate]
  );
  return getBudgetEntryById(userId, result.insertId);
}

async function updateBudgetEntry(userId, id, data) {
  const existing = await getBudgetEntryById(userId, id);
  if (!existing) return null;

  await pool.query(
    `UPDATE budget_entries SET category = ?, amount = ?, payment_method = ?, description = ?, note = ?, entry_date = ?
     WHERE id = ? AND user_id = ?`,
    [
      data.category ?? existing.category,
      data.amount ?? existing.amount,
      data.paymentMethod !== undefined ? data.paymentMethod : existing.payment_method,
      data.description ?? existing.description,
      data.note !== undefined ? data.note : existing.note,
      data.entryDate ?? existing.entry_date,
      id,
      userId
    ]
  );
  return getBudgetEntryById(userId, id);
}

async function deleteBudgetEntry(userId, id) {
  const [result] = await pool.query(
    `DELETE FROM budget_entries WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result.affectedRows > 0;
}

async function getMonthlyTotal(userId, month) {
  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM budget_entries
     WHERE user_id = ? AND DATE_FORMAT(entry_date, '%Y-%m') = ?`,
    [userId, month]
  );
  return Number(rows[0].total);
}

async function getCategoryAverages(userId, months = 3) {
  const [rows] = await pool.query(
    `SELECT category, AVG(monthly_total) AS avg_total FROM (
       SELECT category, DATE_FORMAT(entry_date, '%Y-%m') AS ym, SUM(amount) AS monthly_total
       FROM budget_entries
       WHERE user_id = ? AND entry_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
       GROUP BY category, ym
     ) sub
     GROUP BY category`,
    [userId, months]
  );
  return rows.map(r => ({ category: r.category, avgTotal: Number(r.avg_total) }));
}

module.exports = {
  listBudgetEntries,
  getBudgetEntryById,
  createBudgetEntry,
  updateBudgetEntry,
  deleteBudgetEntry,
  getMonthlyTotal,
  getCategoryAverages
};
