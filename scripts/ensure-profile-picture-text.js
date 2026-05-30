import pool from '../backend/src/config/db.js';

try {
  await pool.query('ALTER TABLE accounts ALTER COLUMN profile_picture TYPE text');

  const [rows] = await pool.query(`
    SELECT data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_name = 'accounts'
      AND column_name = 'profile_picture'
    LIMIT 1
  `);

  console.log(JSON.stringify(rows[0] || null));
} finally {
  await pool.end();
}
