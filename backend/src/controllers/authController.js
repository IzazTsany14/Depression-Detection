/**
 * Authentication Controller
 * Menangani login dan register user dengan verifikasi ke database
 * Menghasilkan JWT token untuk autentikasi frontend
 */
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import '../config/env.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const databaseUnavailableCodes = [
  'ECONNREFUSED',
  'ECONNRESET',
  'ENOTFOUND',
  'ETIMEDOUT',
  'ER_BAD_DB_ERROR',
  'PROTOCOL_CONNECTION_LOST',
  '28P01',
  '3D000'
];

const isDatabaseUnavailable = (error) => (
  databaseUnavailableCodes.includes(error?.code) ||
  databaseUnavailableCodes.some((code) => String(error?.message || '').includes(code))
);

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret === 'your-secret-key') {
    const error = new Error('JWT_SECRET belum dikonfigurasi dengan aman di backend/.env');
    error.status = 500;
    throw error;
  }

  return secret;
};

const signToken = (account) => jwt.sign(
  {
    sub: account.account_id,
    accountId: account.account_id,
    email: account.email,
    role: account.role
  },
  getJwtSecret(),
  { expiresIn: '24h' }
);

const verifyPassword = async (plainPassword, storedPassword) => {
  if (typeof storedPassword === 'string' && storedPassword.startsWith('$2')) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  return plainPassword === storedPassword;
};

const resetTokenExpiryMinutes = 30;

const getPublicAppUrl = (req) => {
  const configuredUrl = process.env.FRONTEND_URL || process.env.APP_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');

  const origin = req.get('origin');
  if (origin) return origin.replace(/\/$/, '');

  return `${req.protocol}://${req.get('host')}`.replace(/\/$/, '');
};

const ensurePasswordResetTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      token_id varchar(50) NOT NULL,
      account_id varchar(50) NOT NULL,
      token_hash varchar(64) NOT NULL,
      expires_at datetime NOT NULL,
      used_at datetime DEFAULT NULL,
      created_at timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (token_id),
      UNIQUE KEY token_hash (token_hash),
      KEY account_id (account_id),
      CONSTRAINT password_reset_tokens_account_fk
        FOREIGN KEY (account_id) REFERENCES accounts (account_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
};

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const getResetTokenRecord = async (token) => {
  await ensurePasswordResetTable();
  const [rows] = await pool.query(
    `SELECT prt.*, a.email
     FROM password_reset_tokens prt
     JOIN accounts a ON prt.account_id = a.account_id
     WHERE prt.token_hash = ?
       AND prt.used_at IS NULL
       AND prt.expires_at > NOW()
     LIMIT 1`,
    [hashResetToken(token)]
  );

  return rows[0] || null;
};

const isEmailJsPlaceholder = (value) => !value || String(value).startsWith('your_');

const sendPasswordResetEmail = async ({ email, name, resetLink }) => {
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID;

  if ([publicKey, serviceId, templateId].some(isEmailJsPlaceholder)) {
    const error = new Error('EmailJS belum dikonfigurasi. Isi VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, dan VITE_EMAILJS_TEMPLATE_ID di .env.');
    error.status = 500;
    throw error;
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_email: email,
        to_name: name || email,
        reset_link: resetLink,
        app_name: 'Depression Detection',
        expires_in: `${resetTokenExpiryMinutes} menit`
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(message || 'Gagal mengirim email reset password');
    error.status = 502;
    throw error;
  }
};

const getUserWithProfile = async (accountId) => {
  const query = `
    SELECT
      a.account_id,
      a.email,
      a.role,
      a.profile_picture,
      a.is_active,
      COALESCE(s.student_id, b.bk_id, ad.admin_id, a.account_id) AS id,
      COALESCE(s.name, b.name, ad.name, a.email) AS name,
      s.nim,
      s.nik,
      s.faculty,
      s.major,
      s.semester,
      s.phone_number,
      b.nip,
      b.nidn,
      b.nuptk,
      b.specialization,
      ad.department
    FROM accounts a
    LEFT JOIN students s ON a.account_id = s.account_id AND a.role = 'student'
    LEFT JOIN bk_staff b ON a.account_id = b.account_id AND a.role = 'bk'
    LEFT JOIN admins ad ON a.account_id = ad.account_id AND a.role = 'admin'
    WHERE a.account_id = ?
    LIMIT 1
  `;

  const [rows] = await pool.query(query, [accountId]);
  if (rows.length === 0) return null;

  const user = rows[0];
  return {
    id: user.id,
    accountId: user.account_id,
    email: user.email,
    role: user.role,
    profile_picture: user.profile_picture,
    name: user.name,
    nim: user.nim,
    nik: user.nik,
    faculty: user.faculty,
    major: user.major,
    semester: user.semester,
    phone_number: user.phone_number,
    nip: user.nip,
    nidn: user.nidn,
    nuptk: user.nuptk,
    specialization: user.specialization,
    department: user.department
  };
};

export const getStudentByNim = async (req, res) => {
  try {
    const nim = String(req.params.nim || '').trim();

    if (!nim) {
      return res.status(400).json({ message: 'NIM harus diisi' });
    }

    const [rows] = await pool.query(
      `SELECT
        s.student_id,
        s.account_id,
        s.nim,
        s.nik,
        s.name,
        s.faculty,
        s.major,
        s.semester,
        s.phone_number,
        a.email
      FROM students s
      JOIN accounts a ON s.account_id = a.account_id
      WHERE s.nim = ?
      LIMIT 1`,
      [nim]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data mahasiswa dengan NIM tersebut tidak ditemukan' });
    }

    res.json({ student: rows[0] });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(503).json({
        message: 'Database belum terhubung. Pastikan MySQL aktif, database depresi tersedia, dan backend/.env sudah benar.'
      });
    }

    res.status(500).json({
      message: 'Gagal mengambil data mahasiswa',
      error: error.message
    });
  }
};

/**
 * Login user dengan email dan password
 * Memeriksa tabel 'accounts' dan mengembalikan JWT token
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email dan password harus diisi' 
      });
    }

    // Query ke tabel accounts sesuai struktur database
    const query = 'SELECT * FROM accounts WHERE email = ?';
    const [rows] = await pool.query(query, [email]);

    // Cek apakah user ditemukan
    if (rows.length === 0) {
      return res.status(404).json({ 
        message: 'Email tidak terdaftar' 
      });
    }

    const user = rows[0];

    if (user.is_active === false || user.is_active === 0) {
      return res.status(403).json({
        message: user.role === 'student' ? 'Akses ditolak. Akun mahasiswa Anda sedang nonaktif. Silakan hubungi admin.' : 'Akses ditolak. Akun Anda sedang nonaktif.'
      });
    }

    const passwordMatches = await verifyPassword(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ 
        message: 'Password salah' 
      });
    }

    await pool.query('UPDATE accounts SET last_login = NOW() WHERE account_id = ?', [user.account_id]);

    const profile = await getUserWithProfile(user.account_id);
    const token = signToken(user);

    // Response dengan token dan user info
    res.status(200).json({
      message: 'Login berhasil',
      token,
      user: profile
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(503).json({
        message: 'Database belum terhubung. Pastikan MySQL aktif, database depresi tersedia, dan backend/.env sudah benar.'
      });
    }

    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat login',
      error: error.message 
    });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Email harus diisi' });
    }

    const [rows] = await pool.query(
      `SELECT
        a.account_id,
        a.email,
        a.is_active,
        COALESCE(s.name, b.name, ad.name, a.email) AS name
       FROM accounts a
       LEFT JOIN students s ON a.account_id = s.account_id AND a.role = 'student'
       LEFT JOIN bk_staff b ON a.account_id = b.account_id AND a.role = 'bk'
       LEFT JOIN admins ad ON a.account_id = ad.account_id AND a.role = 'admin'
       WHERE LOWER(a.email) = ?
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email tidak terdaftar' });
    }

    const account = rows[0];
    if (account.is_active === false || account.is_active === 0) {
      return res.status(403).json({ message: 'Akun sedang nonaktif. Silakan hubungi admin.' });
    }

    await ensurePasswordResetTable();
    await pool.query(
      'UPDATE password_reset_tokens SET used_at = NOW() WHERE account_id = ? AND used_at IS NULL',
      [account.account_id]
    );

    const token = crypto.randomBytes(32).toString('hex');
    const resetLink = `${getPublicAppUrl(req)}/reset-password?token=${encodeURIComponent(token)}`;

    await pool.query(
      `INSERT INTO password_reset_tokens (token_id, account_id, token_hash, expires_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
      [`reset-${uuidv4().slice(0, 8)}`, account.account_id, hashResetToken(token), resetTokenExpiryMinutes]
    );

    await sendPasswordResetEmail({
      email: account.email,
      name: account.name,
      resetLink
    });

    res.json({ message: 'Link reset password berhasil dikirim ke email terdaftar.' });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(503).json({
        message: 'Database belum terhubung. Pastikan MySQL aktif, database depresi tersedia, dan backend/.env sudah benar.'
      });
    }

    res.status(error.status || 500).json({
      message: error.status === 500 ? error.message : 'Gagal mengirim link reset password',
      error: error.message
    });
  }
};

export const verifyPasswordResetToken = async (req, res) => {
  try {
    const token = String(req.query.token || req.body.token || '').trim();
    if (!token) return res.status(400).json({ message: 'Token reset password wajib diisi' });

    const record = await getResetTokenRecord(token);
    if (!record) {
      return res.status(400).json({ message: 'Link reset password tidak valid atau sudah kadaluarsa' });
    }

    res.json({ valid: true, email: record.email });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memverifikasi link reset password',
      error: error.message
    });
  }
};

export const resetPasswordWithToken = async (req, res) => {
  try {
    const token = String(req.body.token || '').trim();
    const newPassword = String(req.body.newPassword || '');

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token dan password baru wajib diisi' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    const record = await getResetTokenRecord(token);
    if (!record) {
      return res.status(400).json({ message: 'Link reset password tidak valid atau sudah kadaluarsa' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE accounts SET password = ? WHERE account_id = ?', [hashedPassword, record.account_id]);
    await pool.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE token_id = ?', [record.token_id]);

    res.json({ message: 'Password berhasil direset. Silakan login dengan password baru.' });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mereset password',
      error: error.message
    });
  }
};

/**
 * Register user baru
 * Membuat akun di tabel 'accounts'
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "role": "student" // atau "bk" atau "admin"
 * }
 */
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      nim,
      nik,
      faculty,
      major,
      semester,
      nip,
      nidn,
      nuptk,
      department
    } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email dan password harus diisi' 
      });
    }

    // Registrasi publik hanya boleh membuat akun mahasiswa.
    // Akun admin/BK harus dibuat oleh admin melalui /api/users.
    const validRoles = ['student', 'bk', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: `Role harus salah satu dari: ${validRoles.join(', ')}` 
      });
    }

    if (role !== 'student') {
      return res.status(403).json({
        message: 'Registrasi admin/BK tidak diizinkan dari endpoint publik'
      });
    }

    const connection = await pool.getConnection();
    let accountId;

    try {
      await connection.beginTransaction();

      const hashedPassword = await bcrypt.hash(password, 12);

      if (role === 'student') {
        if (!nim) {
          await connection.rollback();
          return res.status(400).json({ message: 'NIM harus diisi' });
        }

        const [studentRows] = await connection.query(
          'SELECT * FROM students WHERE nim = ? LIMIT 1',
          [nim]
        );

        if (studentRows.length === 0) {
          await connection.rollback();
          return res.status(404).json({ message: 'Data mahasiswa dengan NIM tersebut tidak ditemukan' });
        }

        const student = studentRows[0];
        accountId = student.account_id;

        const [emailRows] = await connection.query(
          'SELECT account_id FROM accounts WHERE email = ? AND account_id <> ? LIMIT 1',
          [email, accountId]
        );

        if (emailRows.length > 0) {
          await connection.rollback();
          return res.status(409).json({ message: 'Email sudah digunakan akun lain' });
        }

        await connection.query(
          'UPDATE accounts SET email = ?, password = ?, role = ?, is_active = 1 WHERE account_id = ?',
          [email, hashedPassword, role, accountId]
        );

        await connection.query(
          `UPDATE students
           SET nik = COALESCE(?, nik),
               name = COALESCE(?, name),
               faculty = COALESCE(?, faculty),
               major = COALESCE(?, major),
               semester = COALESCE(?, semester)
           WHERE account_id = ?`,
          [
            nik || null,
            name || null,
            faculty || null,
            major || null,
            semester || null,
            accountId
          ]
        );
      } else if (role === 'bk') {
        const [existingUser] = await connection.query('SELECT * FROM accounts WHERE email = ? LIMIT 1', [email]);
        if (existingUser.length > 0) {
          await connection.rollback();
          return res.status(409).json({ message: 'Email sudah terdaftar' });
        }

        accountId = `${role}-${uuidv4().substring(0, 8)}`;
        await connection.query(
          'INSERT INTO accounts (account_id, email, password, role) VALUES (?, ?, ?, ?)',
          [accountId, email, hashedPassword, role]
        );

        const bkId = `bk-${uuidv4().substring(0, 8)}`;
        await connection.query(
          `INSERT INTO bk_staff (bk_id, account_id, nip, nidn, nuptk, name)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [bkId, accountId, nip || null, nidn || null, nuptk || null, name || email.split('@')[0]]
        );
      } else if (role === 'admin') {
        const [existingUser] = await connection.query('SELECT * FROM accounts WHERE email = ? LIMIT 1', [email]);
        if (existingUser.length > 0) {
          await connection.rollback();
          return res.status(409).json({ message: 'Email sudah terdaftar' });
        }

        accountId = `${role}-${uuidv4().substring(0, 8)}`;
        await connection.query(
          'INSERT INTO accounts (account_id, email, password, role) VALUES (?, ?, ?, ?)',
          [accountId, email, hashedPassword, role]
        );

        const adminId = `admin-${uuidv4().substring(0, 8)}`;
        await connection.query(
          'INSERT INTO admins (admin_id, account_id, name, department) VALUES (?, ?, ?, ?)',
          [adminId, accountId, name || email.split('@')[0], department || null]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    const account = { account_id: accountId, email, role };
    const token = signToken(account);
    const profile = await getUserWithProfile(accountId);

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: profile
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat registrasi',
      error: error.message 
    });
  }
};

/**
 * Logout user (client-side operation, server bisa clear token di blacklist jika diperlukan)
 */
export const logout = (req, res) => {
  res.status(200).json({
    message: 'Logout berhasil. Hapus token dari sessionStorage di frontend.'
  });
};

/**
 * Get current user info dari token
 */
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User tidak authenticated' });
    }

    const accountId = req.user.accountId || req.user.id;
    const user = await getUserWithProfile(accountId);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(503).json({
        message: 'Database belum terhubung. Pastikan MySQL aktif, database depresi tersedia, dan backend/.env sudah benar.'
      });
    }

    res.status(500).json({ 
      message: 'Error mendapatkan user info',
      error: error.message 
    });
  }
};

