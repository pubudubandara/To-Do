import mysql from 'mysql2/promise';

// Create a connection
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'rootpassword',
  database: process.env.MYSQL_DATABASE || 'task_db',
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ensure the database and required tables exist
export async function ensureSchema() {
  const host = process.env.MYSQL_HOST || 'localhost';
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || 'rootpassword';
  const port = Number(process.env.MYSQL_PORT) || 3306;
  const database = process.env.MYSQL_DATABASE || 'task_db';

  // Step 1: Ensure the database exists
  const serverConn = await mysql.createConnection({ host, user, password, port, multipleStatements: true });
  try {
    await serverConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } finally {
    await serverConn.end();
  }

  // Step 2: Ensure the table exists inside the database 
  await pool.query(`
    CREATE TABLE IF NOT EXISTS task (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      is_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP NULL DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Step 3: In case the table already existed without the new columns, try to add them safely
  try {
    await pool.query(`
      ALTER TABLE task
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL DEFAULT NULL
    `);
  } catch (e: any) {
    // For MySQL versions without IF NOT EXISTS, ignore duplicate column errors
    if (e && e.code !== 'ER_DUP_FIELDNAME') {
      throw e;
    }
  }
}