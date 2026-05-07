import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const profileUploadDir = path.resolve(__dirname, '../../uploads/profiles');

const getUsersQuery = `
  SELECT
    a.account_id,
    a.email,
    a.role,
    a.profile_picture,
    a.is_active,
    a.created_at,
    COALESCE(s.student_id, b.bk_id, ad.admin_id, a.account_id) AS id,
    COALESCE(s.name, b.name, ad.name, a.email) AS name,
    s.student_id,
    s.nim,
    s.nik,
    s.faculty,
    s.major,
    s.semester,
    s.phone_number,
    b.bk_id,
    b.nip,
    b.nidn,
    b.nuptk,
    b.specialization,
    ad.admin_id,
    ad.department
  FROM accounts a
  LEFT JOIN students s ON a.account_id = s.account_id AND a.role = 'student'
  LEFT JOIN bk_staff b ON a.account_id = b.account_id AND a.role = 'bk'
  LEFT JOIN admins ad ON a.account_id = ad.account_id AND a.role = 'admin'
`;

const normalizeUser = (user) => ({
  ...user,
  id: user.id || user.account_id,
  accountId: user.account_id,
  profilePicture: user.profile_picture
});

const getUserByAccountId = async (accountId) => {
  const [rows] = await pool.query(`${getUsersQuery} WHERE a.account_id = ? LIMIT 1`, [accountId]);
  return rows[0] ? normalizeUser(rows[0]) : null;
};

const saveProfileImage = async (profileImage, accountId) => {
  if (!profileImage?.dataUrl) return null;

  const match = String(profileImage.dataUrl).match(/^data:(image\/(?:png|jpeg));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    const error = new Error('Foto profil harus berupa file PNG atau JPG');
    error.status = 400;
    throw error;
  }

  const mimeType = match[1];
  const extension = mimeType === 'image/png' ? 'png' : 'jpg';
  const buffer = Buffer.from(match[2], 'base64');

  if (buffer.length > 2 * 1024 * 1024) {
    const error = new Error('Ukuran foto profil maksimal 2MB');
    error.status = 400;
    throw error;
  }

  await fs.mkdir(profileUploadDir, { recursive: true });
  const fileName = `${accountId}-${Date.now()}.${extension}`;
  await fs.writeFile(path.join(profileUploadDir, fileName), buffer);

  return `/uploads/profiles/${fileName}`;
};

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`${getUsersQuery} ORDER BY a.role ASC, name ASC`);
    res.json({ data: rows.map(normalizeUser) });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data user dari database',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      name,
      email,
      password,
      role,
      nim,
      nik,
      faculty,
      major,
      semester,
      nip,
      nidn,
      nuptk,
      department,
      profileImage
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Nama, email, password, dan role wajib diisi' });
    }

    if (!['student', 'bk', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid' });
    }

    const accountId = `${role}-${uuidv4().slice(0, 8)}`;
    const profilePicture = await saveProfileImage(profileImage, accountId);
    const hashedPassword = await bcrypt.hash(password, 12);

    await connection.beginTransaction();
    await connection.query(
      'INSERT INTO accounts (account_id, email, password, role, profile_picture) VALUES (?, ?, ?, ?, ?)',
      [accountId, email, hashedPassword, role, profilePicture]
    );

    if (role === 'student') {
      await connection.query(
        `INSERT INTO students (student_id, account_id, nim, nik, name, faculty, major, semester)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [`student-${uuidv4().slice(0, 8)}`, accountId, nim, nik || null, name, faculty || null, major || null, semester || null]
      );
    } else if (role === 'bk') {
      await connection.query(
        `INSERT INTO bk_staff (bk_id, account_id, nip, nidn, nuptk, name)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [`bk-${uuidv4().slice(0, 8)}`, accountId, nip || null, nidn || null, nuptk || null, name]
      );
    } else {
      await connection.query(
        'INSERT INTO admins (admin_id, account_id, name, department) VALUES (?, ?, ?, ?)',
        [`admin-${uuidv4().slice(0, 8)}`, accountId, name, department || null]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'User berhasil ditambahkan', user: await getUserByAccountId(accountId) });
  } catch (error) {
    await connection.rollback();
    res.status(error.status || 500).json({
      message: 'Gagal menambahkan user',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

router.put('/:accountId', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { accountId } = req.params;
    const existingUser = await getUserByAccountId(accountId);
    if (!existingUser) return res.status(404).json({ message: 'User tidak ditemukan' });

    const {
      name,
      email,
      password,
      nim,
      nik,
      faculty,
      major,
      semester,
      nip,
      nidn,
      nuptk,
      department,
      profileImage
    } = req.body;

    const profilePicture = await saveProfileImage(profileImage, accountId);
    const accountFields = ['email = ?'];
    const accountValues = [email];

    if (password) {
      accountFields.push('password = ?');
      accountValues.push(await bcrypt.hash(password, 12));
    }

    if (profilePicture) {
      accountFields.push('profile_picture = ?');
      accountValues.push(profilePicture);
    }

    accountValues.push(accountId);

    await connection.beginTransaction();
    await connection.query(`UPDATE accounts SET ${accountFields.join(', ')} WHERE account_id = ?`, accountValues);

    if (existingUser.role === 'student') {
      await connection.query(
        `UPDATE students SET nim = ?, nik = ?, name = ?, faculty = ?, major = ?, semester = ?
         WHERE account_id = ?`,
        [nim, nik || null, name, faculty || null, major || null, semester || null, accountId]
      );
    } else if (existingUser.role === 'bk') {
      await connection.query(
        'UPDATE bk_staff SET nip = ?, nidn = ?, nuptk = ?, name = ? WHERE account_id = ?',
        [nip || null, nidn || null, nuptk || null, name, accountId]
      );
    } else {
      await connection.query(
        'UPDATE admins SET name = ?, department = ? WHERE account_id = ?',
        [name, department || null, accountId]
      );
    }

    await connection.commit();
    res.json({ message: 'User berhasil diperbarui', user: await getUserByAccountId(accountId) });
  } catch (error) {
    await connection.rollback();
    res.status(error.status || 500).json({
      message: 'Gagal memperbarui user',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

router.delete('/:accountId', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM accounts WHERE account_id = ?', [req.params.accountId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menghapus user',
      error: error.message
    });
  }
});

export default router;
