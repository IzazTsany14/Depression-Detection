/**
 * Express App Setup
 * Konfigurasi middleware, routes, dan error handling
 */
import express from 'express';
import cors from 'cors';
import './config/env.js';
import pool from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Import middleware
import { errorHandler } from './middleware/authMiddleware.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============ MIDDLEWARE ============

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} tidak diizinkan oleh CORS`));
  },
  credentials: true
}));

/**
 * Body Parser
 * Parse JSON dan form-urlencoded request body
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.get('/api/students', async (req, res) => {
  try {
    const query = `
      SELECT
        s.*,
        a.email,
        a.profile_picture,
        a.is_active,
        a.created_at
      FROM students s
      JOIN accounts a ON s.account_id = a.account_id
      ORDER BY s.name ASC
    `;
    const [results] = await pool.query(query);
    res.json({ data: results });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data mahasiswa dari database',
      error: error.message
    });
  }
});

/**
 * Request Logger Middleware
 * Logging setiap request untuk debugging
 */
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// ============ ROUTES ============

/**
 * Health Check Endpoint
 * Gunakan ini untuk memastikan server running
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/users', userRoutes);

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Depression Detection API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tests: '/api/tests',
      health: '/api/health'
    }
  });
});

/**
 * 404 Not Found Handler
 */
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint tidak ditemukan',
    path: req.path,
    method: req.method
  });
});

/**
 * Error Handler Middleware
 * Menangani error dari semua routes
 */
app.use(errorHandler);

export default app;
