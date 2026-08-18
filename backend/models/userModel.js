const { pool } = require('../config/db');

async function createUser({ fullName, email, passwordHash, preferredLanguage, username }) {
  const [result] = await pool.query(
    `INSERT INTO users (full_name, username, email, password_hash, preferred_language)
     VALUES (?, ?, ?, ?, ?)`,
    [fullName, username || null, email, passwordHash, preferredLanguage || 'en']
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, password_hash, preferred_language, created_at
     FROM users WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

async function findUserByUsername(username) {
  const [rows] = await pool.query(
    `SELECT id, full_name, username, email FROM users WHERE username = ? LIMIT 1`,
    [username]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, preferred_language, created_at
     FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function updateAccount(id, { username, email }) {
  await pool.query(
    `UPDATE users SET username = ?, email = ? WHERE id = ?`,
    [username, email, id]
  );
  return findUserById(id);
}

async function findUserByIdWithHash(id) {
  const [rows] = await pool.query(
    `SELECT id, password_hash FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function updatePasswordHash(id, passwordHash) {
  await pool.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [passwordHash, id]);
}

module.exports = {
  createUser, findUserByEmail, findUserByUsername, findUserById,
  updateAccount, findUserByIdWithHash, updatePasswordHash
};
