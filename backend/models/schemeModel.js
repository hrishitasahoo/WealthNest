const { pool } = require('../config/db');

async function listSchemes({ category, search } = {}) {
  let query = `SELECT id, scheme_name, category, purpose, intended_for, eligibility,
                      key_benefits, limitations, official_source, official_url, last_verified_date
               FROM financial_schemes WHERE 1=1`;
  const params = [];

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }
  if (search) {
    query += ` AND (scheme_name LIKE ? OR purpose LIKE ? OR intended_for LIKE ?)`;
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  query += ` ORDER BY scheme_name ASC`;
  const [rows] = await pool.query(query, params);
  return rows;
}

module.exports = { listSchemes };
