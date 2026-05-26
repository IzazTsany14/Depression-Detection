import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import '../backend/src/config/env.js';

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const schemaPath = path.join(rootDir, 'database', 'supabase-schema.sql');
const seedPath = path.join(rootDir, 'database', 'supabase-seed.sql');

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
const useSsl = String(process.env.DB_SSL ?? 'true').toLowerCase() !== 'false';

if (!connectionString) {
  console.error('DATABASE_URL atau SUPABASE_DB_URL belum diisi.');
  process.exit(1);
}

const normalizeConnectionString = (value) => {
  if (!value || !useSsl) return value;

  try {
    const url = new URL(value);
    url.searchParams.delete('sslmode');
    url.searchParams.delete('sslcert');
    url.searchParams.delete('sslkey');
    url.searchParams.delete('sslrootcert');
    url.searchParams.delete('uselibpqcompat');
    return url.toString();
  } catch {
    return value;
  }
};

const pool = new Pool({
  connectionString: normalizeConnectionString(connectionString),
  ...(useSsl && { ssl: { rejectUnauthorized: false } })
});

try {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  await pool.query(schemaSql);
  await pool.query(seedSql);

  const { rows } = await pool.query(`
    select
      (select count(*)::int from accounts) as accounts,
      (select count(*)::int from students) as students,
      (select count(*)::int from test_results) as test_results
  `);

  console.log('Supabase seed selesai:', rows[0]);
} catch (error) {
  console.error('Supabase seed gagal:', error.message || error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
