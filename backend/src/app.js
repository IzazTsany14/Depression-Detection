/**
 * Express App Setup
 * Konfigurasi middleware, routes, dan error handling
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';

// Import middleware
import { errorHandler } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// ============ MIDDLEWARE ============

/**
 * CORS Configuration
 * Mengizinkan request dari frontend (React Vite di localhost:5173)
 */
app.use(cors());

/**
 * Body Parser
 * Parse JSON dan form-urlencoded request body
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/students', async (req, res) => {
  try {
    const query = `
      SELECT
        s.*,
        a.email,
        a.is_active,
        a.created_at
      FROM students s
      JOIN accounts a ON s.account_id = a.account_id
      ORDER BY s.name ASC
    `;
    const [results] = await pool.query(query);
    res.json({ data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
