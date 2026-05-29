/**
 * Test Controller
 * Menangani CRUD operasi untuk test results (DASS-21)
 * Menerima 21 jawaban, menghitung skor DASS-21, dan menyimpan ke database
 */
import pool from '../config/db.js';
import { calculateDassResult, getDepressionDescription } from '../services/dassScoringService.js';
import { v4 as uuidv4 } from 'uuid';

const parseAnswers = (answers) => (
  typeof answers === 'string' ? JSON.parse(answers) : answers
);

const getAuthenticatedAccountId = (req) => req.user?.accountId || req.user?.id;

const getStudentIdForAccount = async (accountId) => {
  const [rows] = await pool.query(
    'SELECT student_id FROM students WHERE account_id = ? LIMIT 1',
    [accountId]
  );
  return rows[0]?.student_id || null;
};

const canAccessStudent = async (req, studentId) => {
  if (req.user?.role !== 'student') return false;

  const authenticatedStudentId = await getStudentIdForAccount(getAuthenticatedAccountId(req));
  return String(authenticatedStudentId) === String(studentId);
};

const getTestOwnerStudentId = async (testId) => {
  const [rows] = await pool.query(
    'SELECT student_id FROM test_results WHERE test_id = ? LIMIT 1',
    [testId]
  );
  return rows[0]?.student_id || null;
};

/**
 * Submit test baru
 * Menerima 21 jawaban dari frontend, kalkulasi DASS-21, simpan ke database
 * 
 * Request body:
 * {
 *   "student_id": 1,
 *   "answers": [0, 1, 2, 0, 1, ...] // Array 21 elemen (0-3)
 * }
 */
export const submitTest = async (req, res) => {
  try {
    const { answers } = req.body;

    // Validasi input
    if (!answers) {
      return res.status(400).json({ 
        message: 'answers harus diisi' 
      });
    }

    if (req.user?.role !== 'student') {
      return res.status(403).json({ message: 'Hanya mahasiswa yang dapat mengirim test' });
    }

    const student_id = await getStudentIdForAccount(getAuthenticatedAccountId(req));
    if (!student_id) {
      return res.status(403).json({ message: 'Akun mahasiswa pada token tidak ditemukan' });
    }

    if (!Array.isArray(answers) || answers.length !== 21) {
      return res.status(400).json({ 
        message: 'Answers harus berupa array dengan 21 elemen' 
      });
    }

    // Validasi setiap answer adalah 0-3
    const validAnswers = answers.every(a => Number.isInteger(a) && a >= 0 && a <= 3);
    if (!validAnswers) {
      return res.status(400).json({ 
        message: 'Setiap answer harus berupa integer 0-3' 
      });
    }

    // Kalkulasi DASS-21 berdasarkan ambang kategori standar.
    const dassResult = calculateDassResult(answers);
    const { score, level, dass21_score } = dassResult;

    // Generate unique test ID
    const test_id = `test-${uuidv4().substring(0, 8)}`;

    // Simpan ke database (sesuai tabel test_results Anda)
    const insertQuery = `
      INSERT INTO test_results (test_id, student_id, date, score, level, dass21_score, answers)
      VALUES (?, ?, NOW(), ?, ?, ?, ?::jsonb)
    `;

    // Convert answers array ke JSON string untuk kolom jsonb PostgreSQL.
    const answersJSON = JSON.stringify(answers);

    const result = await pool.query(insertQuery, [
      test_id,
      student_id,
      score,
      level,
      dass21_score,
      answersJSON
    ]);

    // Dapatkan deskripsi level
    const description = getDepressionDescription(level);

    res.status(201).json({
      message: 'Test berhasil disimpan',
      testResult: {
        test_id,
        student_id,
        score,
        level,
        dass21_score,
        description,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menyimpan test',
      error: error.message 
    });
  }
};

/**
 * Get semua test results untuk seorang student
 * 
 * Query params:
 * GET /api/tests/:student_id
 */
export const getTestsByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;

    // Validasi student_id
    if (!student_id) {
      return res.status(400).json({ 
        message: 'student_id harus diisi' 
      });
    }

    if (!(await canAccessStudent(req, student_id))) {
      return res.status(403).json({ message: 'Akses ditolak. Anda hanya boleh melihat history milik sendiri' });
    }

    // Query test results untuk student
    const query = `
      SELECT test_id, student_id, date, score, level, dass21_score, answers
      FROM test_results
      WHERE student_id = ?
      ORDER BY date DESC
    `;

    const [results] = await pool.query(query, [student_id]);

    // Parse JSON answers kembali ke array
    const parsedResults = results.map(result => ({
      ...result,
      answers: parseAnswers(result.answers)
    }));

    res.status(200).json({
      message: 'Test results berhasil diambil',
      count: results.length,
      results: parsedResults,
      data: parsedResults
    });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil test results',
      error: error.message 
    });
  }
};

/**
 * Get detail test result tertentu
 * 
 * Query params:
 * GET /api/tests/detail/:test_id
 */
export const getTestDetail = async (req, res) => {
  try {
    const { test_id } = req.params;

    if (!test_id) {
      return res.status(400).json({ 
        message: 'test_id harus diisi' 
      });
    }

    const ownerStudentId = await getTestOwnerStudentId(test_id);
    if (!ownerStudentId) {
      return res.status(404).json({
        message: 'Test tidak ditemukan'
      });
    }

    if (!(await canAccessStudent(req, ownerStudentId))) {
      return res.status(403).json({ message: 'Akses ditolak. Anda tidak boleh melihat detail test ini' });
    }

    const query = `
      SELECT test_id, student_id, date, score, level, dass21_score, answers
      FROM test_results
      WHERE test_id = ?
    `;

    const [results] = await pool.query(query, [test_id]);

    if (results.length === 0) {
      return res.status(404).json({ 
        message: 'Test tidak ditemukan' 
      });
    }

    const result = results[0];
    const description = getDepressionDescription(result.level);

    res.status(200).json({
      message: 'Test detail berhasil diambil',
      result: {
        ...result,
        answers: parseAnswers(result.answers),
        description
      }
    });
  } catch (error) {
    console.error('Get test detail error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil test detail',
      error: error.message 
    });
  }
};

/**
 * Get statistik test untuk seorang student
 * Menampilkan rata-rata score, distribution, dll
 */
export const getTestStatistics = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({ 
        message: 'student_id harus diisi' 
      });
    }

    if (!(await canAccessStudent(req, student_id))) {
      return res.status(403).json({ message: 'Akses ditolak. Anda hanya boleh melihat statistik milik sendiri' });
    }

    const query = `
      SELECT
        COUNT(*) as total_tests,
        AVG(score) as avg_score,
        MIN(score) as min_score,
        MAX(score) as max_score,
        COUNT(CASE WHEN level = 'Normal' THEN 1 END) as normal_count,
        COUNT(CASE WHEN level = 'Ringan' THEN 1 END) as mild_count,
        COUNT(CASE WHEN level = 'Sedang' THEN 1 END) as moderate_count,
        COUNT(CASE WHEN level = 'Parah' THEN 1 END) as severe_count,
        COUNT(CASE WHEN level = 'Sangat Parah' THEN 1 END) as extremely_severe_count
      FROM test_results
      WHERE student_id = ?
    `;

    const [stats] = await pool.query(query, [student_id]);

    res.status(200).json({
      message: 'Statistik test berhasil diambil',
      statistics: stats[0]
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat mengambil statistik',
      error: error.message 
    });
  }
};

/**
 * Delete test result
 */
export const deleteTest = async (req, res) => {
  try {
    const { test_id } = req.params;

    if (!test_id) {
      return res.status(400).json({ 
        message: 'test_id harus diisi' 
      });
    }

    const query = 'DELETE FROM test_results WHERE test_id = ?';
    const result = await pool.query(query, [test_id]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Test tidak ditemukan' 
      });
    }

    res.status(200).json({
      message: 'Test berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat menghapus test',
      error: error.message 
    });
  }
};
