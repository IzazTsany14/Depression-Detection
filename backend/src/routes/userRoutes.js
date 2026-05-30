import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

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

const isAccountActive = (value) => (
  value === true ||
  value === 1 ||
  value === '1' ||
  String(value).toLowerCase() === 'true'
);

const normalizeUser = (user) => ({
  ...user,
  id: user.id || user.account_id,
  accountId: user.account_id,
  profilePicture: user.profile_picture,
  is_active: isAccountActive(user.is_active),
  isActive: isAccountActive(user.is_active)
});

const verifyStoredPassword = async (plainPassword, storedPassword) => {
  if (typeof storedPassword === 'string' && storedPassword.startsWith('$2')) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  return plainPassword === storedPassword;
};

const getUserByAccountId = async (accountId) => {
  const [rows] = await pool.query(`${getUsersQuery} WHERE a.account_id = ? LIMIT 1`, [accountId]);
  return rows[0] ? normalizeUser(rows[0]) : null;
};

const getAccountPassword = async (accountId) => {
  const [rows] = await pool.query('SELECT password FROM accounts WHERE account_id = ? LIMIT 1', [accountId]);
  return rows[0]?.password || null;
};

const getAuthenticatedAccountId = (req) => req.user?.accountId || req.user?.id;

const authorizeSelfOrAdmin = (req, res, next) => {
  const authenticatedAccountId = getAuthenticatedAccountId(req);

  if (!authenticatedAccountId) {
    return res.status(401).json({ message: 'User tidak authenticated' });
  }

  if (req.user.role === 'admin' || authenticatedAccountId === req.params.accountId) {
    return next();
  }

  return res.status(403).json({ message: 'Akses ditolak. Anda hanya boleh mengakses data akun sendiri' });
};

const saveProfileImage = async (profileImage) => {
  if (!profileImage?.dataUrl) return null;

  const match = String(profileImage.dataUrl).match(/^data:(image\/(?:png|jpeg));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    const error = new Error('Foto profil harus berupa file PNG atau JPG');
    error.status = 400;
    throw error;
  }

  const mimeType = match[1];
  const buffer = Buffer.from(match[2], 'base64');

  if (buffer.length > 2 * 1024 * 1024) {
    const error = new Error('Ukuran foto profil maksimal 2MB');
    error.status = 400;
    throw error;
  }

  return `data:${mimeType};base64,${match[2]}`;
};

router.use(verifyToken);

router.get('/', authorizeRole('admin'), async (req, res) => {
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

router.post('/', authorizeRole('admin'), async (req, res) => {
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
    const profilePicture = await saveProfileImage(profileImage);
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
      message: error.message || 'Gagal menambahkan user',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

router.put('/:accountId', authorizeSelfOrAdmin, async (req, res) => {
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

    if (password && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak. Ubah password harus melalui endpoint password dengan password saat ini' });
    }

    const profilePicture = await saveProfileImage(profileImage);
    const accountFields = ['email = ?'];
    const accountValues = [email];

    if (password) {
      if (String(password).length < 6) {
        return res.status(400).json({ message: 'Password minimal 6 karakter' });
      }

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
      message: error.message || 'Gagal memperbarui user',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

const handlePasswordChange = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Password saat ini dan password baru wajib diisi' });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'Password baru harus berbeda dari password saat ini' });
    }

    const existingUser = await getUserByAccountId(accountId);
    if (!existingUser) return res.status(404).json({ message: 'User tidak ditemukan' });

    const storedPassword = await getAccountPassword(accountId);
    const passwordMatches = await verifyStoredPassword(currentPassword, storedPassword);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Password saat ini salah' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE accounts SET password = ? WHERE account_id = ?', [hashedPassword, accountId]);

    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengubah password',
      error: error.message
    });
  }
};

router.patch('/:accountId/password', authorizeSelfOrAdmin, handlePasswordChange);
router.put('/:accountId/password', authorizeSelfOrAdmin, handlePasswordChange);

router.patch('/:accountId/status', authorizeRole('admin'), async (req, res) => {
  try {
    const { accountId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive harus bernilai true atau false' });
    }

    const existingUser = await getUserByAccountId(accountId);
    if (!existingUser) return res.status(404).json({ message: 'User tidak ditemukan' });

    if (existingUser.role !== 'student') {
      return res.status(403).json({ message: 'Status aktif/nonaktif hanya dapat diubah untuk mahasiswa' });
    }

    await pool.query('UPDATE accounts SET is_active = ? WHERE account_id = ?', [isActive, accountId]);

    res.json({
      message: isActive ? 'Mahasiswa berhasil diaktifkan' : 'Mahasiswa berhasil dinonaktifkan',
      user: await getUserByAccountId(accountId)
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengubah status mahasiswa',
      error: error.message
    });
  }
});
router.delete('/:accountId', authorizeRole('admin'), async (req, res) => {
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

