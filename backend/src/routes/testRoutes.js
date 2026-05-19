/**
 * Test Routes
 * Menangani endpoint /api/tests/*
 * CRUD operasi untuk test results
 */
import express from 'express';
import {
  submitTest,
  getTestsByStudent,
  getTestDetail,
  getTestStatistics,
  deleteTest
} from '../controllers/testController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';
import pool from '../config/db.js';

const router = express.Router();

router.use(verifyToken);

/**
 * GET /api/tests
 * Get semua test results (Untuk Admin/BK)
 */
router.get('/', authorizeRole('admin', 'bk'), async (req, res) => {
  try {
    const query = `
      SELECT
        t.*,
        s.name as userName,
        s.nim as userNim,
        s.faculty as userFaculty,
        a.email as userEmail
      FROM test_results t 
      JOIN students s ON t.student_id = s.student_id
      JOIN accounts a ON s.account_id = a.account_id
      ORDER BY t.date DESC
    `;
    const [results] = await pool.query(query);
    res.json({ data: results });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data test dari database',
      error: error.message
    });
  }
});

/**
 * POST /api/tests/submit
 * Submit test baru dengan 21 jawaban
 * Body: { student_id, answers: [0,1,2,...] }
 */
router.post('/submit', authorizeRole('student'), submitTest);

/**
 * GET /api/tests/student/:student_id
 * Get semua test results untuk seorang student
 */
router.get('/student/:student_id', getTestsByStudent);

/**
 * GET /api/tests/detail/:test_id
 * Get detail test result tertentu
 */
router.get('/detail/:test_id', getTestDetail);

/**
 * GET /api/tests/statistics/:student_id
 * Get statistik test untuk seorang student
 */
router.get('/statistics/:student_id', getTestStatistics);

/**
 * DELETE /api/tests/:test_id
 * Delete test result
 */
router.delete('/:test_id', authorizeRole('admin'), deleteTest);

export default router;
