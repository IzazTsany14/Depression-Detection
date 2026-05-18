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

const signToken = (account) => jwt.sign(
  {
    accountId: account.account_id,
    email: account.email,
    role: account.role
  },
  process.env.JWT_SECRET || 'your-secret-key',
  { expiresIn: '24h' }
);

const verifyPassword = async (plainPassword, storedPassword) => {
  if (typeof storedPassword === 'string' && storedPassword.startsWith('$2')) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  return plainPassword === storedPassword;
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
        message: 'Akun tidak aktif'
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
        message: 'Database belum terhubung. Pastikan DATABASE_URL Supabase PostgreSQL benar dan schema sudah dijalankan.'
      });
    }

    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat login',
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

    // Validasi role
    const validRoles = ['student', 'bk', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: `Role harus salah satu dari: ${validRoles.join(', ')}` 
      });
    }

    // Cek apakah email sudah terdaftar
    const checkQuery = 'SELECT * FROM accounts WHERE email = ?';
    const [existingUser] = await pool.query(checkQuery, [email]);

    if (existingUser.length > 0) {
      return res.status(409).json({ 
        message: 'Email sudah terdaftar' 
      });
    }

    const connection = await pool.getConnection();
    let accountId;

    try {
      await connection.beginTransaction();

      accountId = `${role}-${uuidv4().substring(0, 8)}`;
      const hashedPassword = await bcrypt.hash(password, 12);
      await connection.query(
        'INSERT INTO accounts (account_id, email, password, role) VALUES (?, ?, ?, ?)',
        [accountId, email, hashedPassword, role]
      );

      if (role === 'student') {
        const studentId = `student-${uuidv4().substring(0, 8)}`;
        const generatedNim = nim || Date.now().toString().slice(-10);
        await connection.query(
          `INSERT INTO students (student_id, account_id, nim, nik, name, faculty, major, semester)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            studentId,
            accountId,
            generatedNim,
            nik || null,
            name || email.split('@')[0],
            faculty || null,
            major || null,
            semester || null
          ]
        );
      } else if (role === 'bk') {
        const bkId = `bk-${uuidv4().substring(0, 8)}`;
        await connection.query(
          `INSERT INTO bk_staff (bk_id, account_id, nip, nidn, nuptk, name)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [bkId, accountId, nip || null, nidn || null, nuptk || null, name || email.split('@')[0]]
        );
      } else if (role === 'admin') {
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
    message: 'Logout berhasil. Hapus token dari localStorage di frontend.'
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
        message: 'Database belum terhubung. Pastikan DATABASE_URL Supabase PostgreSQL benar dan schema sudah dijalankan.'
      });
    }

    res.status(500).json({ 
      message: 'Error mendapatkan user info',
      error: error.message 
    });
  }
};
