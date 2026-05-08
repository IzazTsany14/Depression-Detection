/**
 * Authentication Middleware
 * Memverifikasi JWT token dari request dan mengekstrak user info
 * Memeriksa role user untuk authorization
 */
import jwt from 'jsonwebtoken';
import '../config/env.js';

/**
 * Middleware untuk verifikasi JWT token
 * Token harus dikirim di header: Authorization: Bearer <token>
 */
export const verifyToken = (req, res, next) => {
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

    // Verifikasi dan decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Simpan user info di request object untuk digunakan di controller
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token sudah kadaluarsa' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
    res.status(500).json({ message: 'Error verifikasi token', error: error.message });
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
