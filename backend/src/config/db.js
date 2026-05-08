/**
 * Database Configuration
 * Menggunakan mysql2/promise untuk performa async yang optimal.
 */
import mysql from 'mysql2/promise';
import './env.js';

const useSsl = String(process.env.DB_SSL || '').toLowerCase() === 'true';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'depresi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  ...(useSsl && { ssl: { rejectUnauthorized: false } })
});

pool.getConnection()
  .then((connection) => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message || error.code || error);
    console.error('Pastikan MySQL berjalan dan database depresi sudah di-import dari database/depresi.sql');
  });

export default pool;
