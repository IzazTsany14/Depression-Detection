/**
 * Database Configuration
 * Menggunakan pg untuk koneksi ke Supabase PostgreSQL.
 */
import pg from 'pg';
import './env.js';

const { Pool } = pg;

const useSsl = String(process.env.DB_SSL ?? 'true').toLowerCase() !== 'false';
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
const hasSeparateConfig = Boolean(process.env.DB_HOST && process.env.DB_PASSWORD);
const hasDatabaseConfig = Boolean(connectionString || hasSeparateConfig);

const pgPool = hasDatabaseConfig
  ? new Pool({
      ...(connectionString
        ? { connectionString }
        : {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 5432),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'postgres'
          }),
      max: Number(process.env.DB_POOL_SIZE || 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ...(useSsl && { ssl: { rejectUnauthorized: false } })
    })
  : null;

const toPostgresQuery = (query) => {
  let paramIndex = 0;
  return query.replace(/\?/g, () => `$${++paramIndex}`);
};

const formatResult = (result) => {
  if (result.command === 'SELECT') {
    return [result.rows, result.fields];
  }

  return [
    {
      affectedRows: result.rowCount,
      rowCount: result.rowCount,
      command: result.command
    },
    result.fields
  ];
};

const createExecutor = (executor) => async (query, params = []) => {
  if (!executor) {
    throw new Error('DATABASE_URL Supabase PostgreSQL belum diisi di backend/.env');
  }

  const result = await executor.query(toPostgresQuery(query), params);
  return formatResult(result);
};

const pool = {
  query: createExecutor(pgPool),
  async getConnection() {
    if (!pgPool) {
      throw new Error('DATABASE_URL Supabase PostgreSQL belum diisi di backend/.env');
    }

    const client = await pgPool.connect();

    return {
      query: createExecutor(client),
      beginTransaction: () => client.query('BEGIN'),
      commit: () => client.query('COMMIT'),
      rollback: () => client.query('ROLLBACK'),
      release: () => client.release()
    };
  },
  end: () => pgPool?.end()
};

if (!hasDatabaseConfig) {
  console.error('Database configuration missing: isi DATABASE_URL Supabase PostgreSQL di backend/.env');
} else {
  pgPool.query('SELECT 1')
    .then(() => {
      console.log('Supabase PostgreSQL connected successfully');
    })
    .catch((error) => {
      console.error('Database connection failed:', error.message || error.code || error);
      console.error('Pastikan DATABASE_URL/SUPABASE_DB_URL mengarah ke Supabase PostgreSQL dan schema sudah dijalankan.');
    });
}

export default pool;
