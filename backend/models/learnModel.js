const { pool } = require('../config/db');

async function listLearningTopics({ category } = {}) {
  let query = `SELECT id, slug, title, category, simple_explanation, example_text, key_points, display_order
               FROM learning_topics WHERE 1=1`;
  const params = [];

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  query += ` ORDER BY display_order ASC`;
  const [rows] = await pool.query(query, params);
  return rows.map(r => ({
    ...r,
    key_points: typeof r.key_points === 'string' ? JSON.parse(r.key_points) : r.key_points
  }));
}

async function getLearningTopicBySlug(slug) {
  const [rows] = await pool.query(
    `SELECT id, slug, title, category, simple_explanation, example_text, key_points, display_order
     FROM learning_topics WHERE slug = ? LIMIT 1`,
    [slug]
  );
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    ...row,
    key_points: typeof row.key_points === 'string' ? JSON.parse(row.key_points) : row.key_points
  };
}

module.exports = { listLearningTopics, getLearningTopicBySlug };
