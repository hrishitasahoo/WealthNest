require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runSqlFile(connection, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`[seed] Running ${path.basename(filePath)}...`);
  await connection.query(sql);
  console.log(`[seed] Done: ${path.basename(filePath)}`);
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    await runSqlFile(connection, path.join(__dirname, 'schema.sql'));
    await runSqlFile(connection, path.join(__dirname, 'seed.sql'));
    console.log('[seed] Database setup complete. Demo login: demo@wealthnest.in / Demo@1234');
  } catch (err) {
    console.error('[seed] Failed:', err.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

main();
