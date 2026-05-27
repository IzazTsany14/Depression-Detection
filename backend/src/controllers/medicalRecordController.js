import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const parseDateOrNull = (value) => {
  const trimmed = String(value || '').trim();
  return trimmed || null;
};

const mapMedicalRecord = (record) => ({
  id: record.record_id,
  studentName: record.student_name || '',
  nik: record.nik || '',
  nim: record.nim || '',
  faculty: record.faculty || '',
  major: record.major || '',
  semester: record.semester ? String(record.semester) : '',
  consultationDate: record.consultation_date,
  consultationType: record.consultation_type || 'Individual',
  symptoms: record.complaint || '',
  diagnosis: record.diagnosis || '',
  depressionLevel: record.depression_level || 'Normal',
  interventions: record.interventions || '',
  recommendations: record.recommendation || '',
  followUpDate: record.follow_up_date || '',
  counselorName: record.counselor_name || record.bk_name || '',
  counselorNotes: record.counselor_notes || '',
  createdAt: record.created_at || record.consultation_date
});

const selectMedicalRecordQuery = `
  SELECT
    mr.*,
    s.name AS student_name,
    s.nim,
    s.nik,
    s.faculty,
    s.major,
    s.semester,
    b.name AS bk_name
  FROM medical_records mr
  JOIN students s ON mr.student_id = s.student_id
  JOIN bk_staff b ON mr.bk_id = b.bk_id
`;

export const getMedicalRecords = async (req, res) => {
  try {
    const [records] = await pool.query(
      `${selectMedicalRecordQuery}
       ORDER BY mr.created_at DESC, mr.consultation_date DESC`
    );

    res.json({
      data: records.map(mapMedicalRecord)
    });
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({
      message: 'Gagal mengambil data rekam medis',
      error: error.message
    });
  }
};

export const createMedicalRecord = async (req, res) => {
  try {
    const {
      nim,
      consultationDate,
      consultationType,
      symptoms,
      diagnosis,
      depressionLevel,
      interventions,
      recommendations,
      followUpDate,
      counselorName,
      counselorNotes
    } = req.body;

    if (!nim || !consultationDate) {
      return res.status(400).json({ message: 'NIM dan tanggal konsultasi wajib diisi' });
    }

    const [students] = await pool.query(
      'SELECT student_id FROM students WHERE nim = ? LIMIT 1',
      [String(nim).trim()]
    );

    if (students.length === 0) {
      return res.status(404).json({ message: 'Mahasiswa dengan NIM tersebut tidak ditemukan' });
    }

    const [bkRows] = await pool.query(
      'SELECT bk_id, name FROM bk_staff WHERE bk_id = ? LIMIT 1',
      [req.user.id]
    );

    if (bkRows.length === 0) {
      return res.status(403).json({ message: 'Akun BK pada token tidak ditemukan' });
    }

    const recordId = `RM-${uuidv4().slice(0, 8)}`;
    const resolvedCounselorName = String(counselorName || '').trim() || bkRows[0].name;

    await pool.query(
      `INSERT INTO medical_records (
        record_id,
        student_id,
        bk_id,
        consultation_date,
        consultation_type,
        complaint,
        diagnosis,
        depression_level,
        interventions,
        recommendation,
        follow_up_date,
        counselor_name,
        counselor_notes,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', NOW())`,
      [
        recordId,
        students[0].student_id,
        req.user.id,
        consultationDate,
        consultationType || 'Individual',
        symptoms || null,
        diagnosis || null,
        depressionLevel || 'Normal',
        interventions || null,
        recommendations || null,
        parseDateOrNull(followUpDate),
        resolvedCounselorName,
        counselorNotes || null
      ]
    );

    const [createdRecords] = await pool.query(
      `${selectMedicalRecordQuery}
       WHERE mr.record_id = ?
       LIMIT 1`,
      [recordId]
    );

    res.status(201).json({
      message: 'Rekam medis berhasil disimpan',
      record: mapMedicalRecord(createdRecords[0])
    });
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({
      message: 'Gagal menyimpan rekam medis',
      error: error.message
    });
  }
};

export const deleteMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    const [result] = await pool.query(
      'DELETE FROM medical_records WHERE record_id = ?',
      [recordId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
    }

    res.json({ message: 'Rekam medis berhasil dihapus' });
  } catch (error) {
    console.error('Delete medical record error:', error);
    res.status(500).json({
      message: 'Gagal menghapus rekam medis',
      error: error.message
    });
  }
};
