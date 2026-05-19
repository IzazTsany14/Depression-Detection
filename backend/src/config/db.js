/**
 * Database Configuration
 * Menggunakan MySQL/MariaDB dengan database default `depresi`.
 */
import mysql from 'mysql2/promise';
import './env.js';

const hasDatabaseConfig = Boolean(process.env.DB_HOST || process.env.DB_USER || process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'depresi',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  queueLimit: 0,
  timezone: 'Z'
});

pool.query('SELECT 1')
  .then(() => {
    console.log('MySQL connected successfully');
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message || error.code || error);
    console.error('Pastikan MySQL/MariaDB aktif, database `depresi` sudah dibuat, dan backend/.env sudah benar.');
  });

if (!hasDatabaseConfig) {
  console.warn('Database config tidak lengkap, memakai default MySQL: root@127.0.0.1:3306/depresi');
}

export default pool;
