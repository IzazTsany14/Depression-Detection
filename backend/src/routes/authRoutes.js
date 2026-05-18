/**
 * Authentication Routes
 * Menangani endpoint /api/auth/*
 */
import express from 'express';
import { login, register, logout, getCurrentUser, getStudentByNim } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Login dengan email dan password
 * Body: { email, password }
 */
router.post('/login', login);

/**
 * POST /api/auth/register
 * Register user baru
 * Body: { email, password, role? }
 */
router.post('/register', register);

/**
 * GET /api/auth/students/nim/:nim
 * Ambil data pribadi mahasiswa untuk autofill registrasi
 */
router.get('/students/nim/:nim', getStudentByNim);

/**
 * POST /api/auth/logout
 * Logout user (mainly client-side operation)
 */
router.post('/logout', logout);

/**
 * GET /api/auth/me
 * Get current user info (memerlukan token)
 */
router.get('/me', verifyToken, getCurrentUser);

export default router;
