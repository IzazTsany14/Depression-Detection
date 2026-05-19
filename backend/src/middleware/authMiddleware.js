/**
 * Authentication Middleware
 * Memverifikasi JWT token dari request dan mengekstrak user info
 * Memeriksa role user untuk authorization
 */
import jwt from 'jsonwebtoken';
import '../config/env.js';
import pool from '../config/db.js';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret === 'your-secret-key') {
    const error = new Error('JWT_SECRET belum dikonfigurasi dengan aman di backend/.env');
    error.status = 500;
    throw error;
  }

  return secret;
};

/**
 * Middleware untuk verifikasi JWT token
 * Token harus dikirim di header: Authorization: Bearer <token>
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Cek apakah header Authorization ada
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Token tidak ditemukan. Gunakan format: Authorization: Bearer <token>' 
      });
    }

    // Extract token dari "Bearer <token>"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    // Verifikasi signature token lebih dulu, lalu validasi lagi ke database.
    const decoded = jwt.verify(token, getJwtSecret());
    const accountId = decoded.accountId || decoded.id || decoded.sub;

    if (!accountId) {
      return res.status(401).json({ message: 'Token tidak memiliki identitas akun yang valid' });
    }

    const [rows] = await pool.query(
      `SELECT
        a.account_id,
        a.email,
        a.role,
        a.is_active,
        COALESCE(s.student_id, b.bk_id, ad.admin_id, a.account_id) AS profile_id
       FROM accounts a
       LEFT JOIN students s ON a.account_id = s.account_id AND a.role = 'student'
       LEFT JOIN bk_staff b ON a.account_id = b.account_id AND a.role = 'bk'
       LEFT JOIN admins ad ON a.account_id = ad.account_id AND a.role = 'admin'
       WHERE a.account_id = ?
       LIMIT 1`,
      [accountId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Akun pada token tidak ditemukan' });
    }

    const account = rows[0];
    if (account.is_active === false || account.is_active === 0) {
      return res.status(403).json({ message: 'Akun pada token sudah tidak aktif' });
    }

    // Role/email/profile_id diambil dari database, bukan dipercaya dari payload token.
    req.user = {
      ...decoded,
      id: account.profile_id,
      accountId: account.account_id,
      email: account.email,
      role: account.role
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token sudah kadaluarsa' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
    res.status(error.status || 500).json({ message: 'Error verifikasi token', error: error.message });
  }
};

/**
 * Middleware untuk mengecek role user tertentu
 * @param {...string} allowedRoles - Role yang diizinkan (misal: 'student', 'bk', 'admin')
 */
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User info tidak ditemukan' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Akses ditolak. Role yang diizinkan: ${allowedRoles.join(', ')}`,
        yourRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware untuk error handling
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
