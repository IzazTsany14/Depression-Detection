-- Seed data converted from d:/download/depresi.sql for Supabase PostgreSQL.
-- Safe to run repeatedly; existing rows are updated by primary key.

begin;

insert into accounts (account_id, email, password, role, profile_picture, is_active, last_login, created_at) values
('admin-001', 'adminsistem@universitas.ac.id', '$2b$12$a0qBsvOL.zACOew44euil.d9mYYADuNnALK2YJYWNlbgOhg2njA9.', 'admin', NULL, true, '2026-05-25 11:30:23', '2026-05-08 10:58:15'),
('admin-d78400cd', 'izazsr15@gmail.com', '$2a$12$n02UaSZ/AWYQWpEmaGw8vu5n2JdXFEMNfKZNEgnoIAx58VzfzNIQK', 'admin', 'uploads/profiles/staff/admin-d78400cd/profile.jpg', true, '2026-05-25 11:31:33', '2026-05-11 07:15:16'),
('bk-001', 'budisantoso@universitas.ac.id', '$2b$12$GMTJGdzRoK5gP5HcJN8Iv.Y0w4n9PGJpc7aIVKAl2XjLvZIqL16g6', 'bk', NULL, true, '2026-05-19 16:17:54', '2026-05-08 10:58:15'),
('bk-002', 'sitinurhaliza@universitas.ac.id', '$2b$12$GMTJGdzRoK5gP5HcJN8Iv.Y0w4n9PGJpc7aIVKAl2XjLvZIqL16g6', 'bk', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-001', 'ahmadfauzi01@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', 'uploads/profiles/fisipol/student-001/profile.jpg', true, '2026-05-25 11:59:57', '2026-05-08 10:58:15'),
('student-002', 'sitirahmawati02@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-003', 'budihartono03@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-004', 'dewikusuma04@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-005', 'ekoprasetyo05@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, '2026-05-10 10:25:24', '2026-05-08 10:58:15'),
('student-006', 'ratnawijaya06@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-007', 'hendragunawan07@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-008', 'indahsulistyo08@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-009', 'jokopambudi09@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-010', 'kimberlytan10@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-011', 'linamarlina11@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-012', 'maulanarizki12@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-013', 'nandapratama13@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-014', 'oktapermana14@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-015', 'priyasantoso15@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-016', 'quentinridho16@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-017', 'rinadwi17@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-018', 'sintanurma18@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-019', 'tonisuryanto19@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15'),
('student-020', 'camekmulyono34@mhs.universitas.ac.id', '$2b$12$nS6PnA6rADW5uJVcKtOiUe6MEoOiTI9EG0qXmWZ3Ch7whbdOaipHy', 'student', NULL, true, NULL, '2026-05-08 10:58:15')
on conflict (account_id) do update set email = excluded.email, password = excluded.password, role = excluded.role, profile_picture = excluded.profile_picture, is_active = excluded.is_active, last_login = excluded.last_login, created_at = excluded.created_at;

insert into admins (admin_id, account_id, name, department) values
('admin-001', 'admin-001', 'Dr. Admin Sistem', NULL),
('admin-07336665', 'admin-d78400cd', 'Rizki Rahardian', NULL)
on conflict (admin_id) do update set account_id = excluded.account_id, name = excluded.name, department = excluded.department;

insert into bk_staff (bk_id, account_id, nip, nidn, nuptk, name, specialization) values
('bk-001', 'bk-001', NULL, NULL, NULL, 'Psikolog Budi Santoso, M.Psi', NULL),
('bk-002', 'bk-002', NULL, NULL, NULL, 'Dr. Siti Nurhaliza, M.Psi', NULL)
on conflict (bk_id) do update set account_id = excluded.account_id, nip = excluded.nip, nidn = excluded.nidn, nuptk = excluded.nuptk, name = excluded.name, specialization = excluded.specialization;

insert into students (student_id, account_id, nim, nik, name, faculty, major, semester, phone_number) values
('student-001', 'student-001', '2021110001', '3201051998123001', 'Ahmad Fauzi', 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)', 'Ilmu Administrasi', 6, NULL),
('student-002', 'student-002', '2021110002', '3206021999234002', 'Siti Rahmawati', 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)', 'Ilmu Komunikasi', 6, NULL),
('student-003', 'student-003', '2020110015', '3571021996345003', 'Budi Hartono', 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)', 'Ilmu Politik', 8, NULL),
('student-004', 'student-004', '2022110030', '3502031997456004', 'Dewi Kusuma', 'Fakultas Ekonomi dan Bisnis (FEB)', 'Akuntansi', 4, NULL),
('student-005', 'student-005', '2021110045', '3514121995567005', 'Eko Prasetyo', 'Fakultas Ekonomi dan Bisnis (FEB)', 'Manajemen', 6, NULL),
('student-006', 'student-006', '2021110046', '3301011997123456', 'Ratna Wijaya', 'Fakultas Ekonomi dan Bisnis (FEB)', 'Ekonomi Pembangunan', 5, NULL),
('student-007', 'student-007', '2021110050', '3406021996234567', 'Hendra Gunawan', 'Fakultas Teknik (FT)', 'Teknik Informatika', 6, NULL),
('student-008', 'student-008', '2021110051', '3502121997345678', 'Indah Sulistyo', 'Fakultas Teknik (FT)', 'Teknik Elektro', 6, NULL),
('student-009', 'student-009', '2020110060', '3211231996456789', 'Joko Pambudi', 'Fakultas Teknik (FT)', 'Teknik Sipil', 8, NULL),
('student-010', 'student-010', '2022110070', '3601121997567890', 'Kimberly Tan', 'Fakultas Teknik (FT)', 'Teknik Mesin', 4, NULL),
('student-011', 'student-011', '2021110080', '3701051998678901', 'Lina Marlina', 'Fakultas Vokasi (FV)', 'D3 Perhotelan', 5, NULL),
('student-012', 'student-012', '2021110081', '3302061998789012', 'Maulana Rizki', 'Fakultas Vokasi (FV)', 'D3 Pariwisata', 5, NULL),
('student-013', 'student-013', '2021110090', '3401121997890123', 'Nanda Pratama', 'Fakultas Hukum (FH)', 'Ilmu Hukum', 6, NULL),
('student-014', 'student-014', '2020110100', '3502181996901234', 'Okta Permana', 'Fakultas Hukum (FH)', 'Ilmu Hukum', 8, NULL),
('student-015', 'student-015', '2021110110', '3301051998012345', 'Priya Santoso', 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)', 'Matematika', 6, NULL),
('student-016', 'student-016', '2021110111', '3401101997123456', 'Quentin Ridho', 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)', 'Fisika', 6, NULL),
('student-017', 'student-017', '2021110112', '3502111996234567', 'Rina Dwi', 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)', 'Kimia', 6, NULL),
('student-018', 'student-018', '2022110120', '3601201997345678', 'Sinta Nurma', 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)', 'Biologi', 4, NULL),
('student-019', 'student-019', '2021110130', NULL, 'Toni Suryanto', 'Fakultas PSDKU', 'Manajemen', 6, NULL),
('student-020', 'student-020', '2022110140', '3503151998567890', 'Camek Mulyono', 'Fakultas PSDKU', 'Pendidikan Tata Rias', 4, NULL)
on conflict (student_id) do update set account_id = excluded.account_id, nim = excluded.nim, nik = excluded.nik, name = excluded.name, faculty = excluded.faculty, major = excluded.major, semester = excluded.semester, phone_number = excluded.phone_number;

insert into test_results (test_id, student_id, date, score, level, fuzzy_score, answers) values
('test-001-1', 'student-001', '2026-03-01 10:30:00', 54, 'Parah', 0.8500, '[3,3,2,3,2,3,2,3,3,2,3,2,3,2,3,2,3,2,3,2,3]'::jsonb),
('test-001-2', 'student-001', '2026-04-01 09:15:00', 51, 'Parah', 0.8200, '[3,2,3,2,3,2,3,2,2,3,2,3,2,3,2,2,3,2,3,2,2]'::jsonb),
('test-001-3', 'student-001', '2026-04-10 14:20:00', 42, 'Sedang', 0.6800, '[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]'::jsonb),
('test-002-1', 'student-002', '2026-03-15 11:00:00', 32, 'Sedang', 0.5500, '[2,2,1,2,1,2,1,2,2,1,2,1,2,1,2,1,2,1,2,1,2]'::jsonb),
('test-002-2', 'student-002', '2026-04-05 13:30:00', 28, 'Ringan', 0.4500, '[1,2,1,1,2,1,2,1,1,2,1,2,1,1,2,1,1,2,1,1,2]'::jsonb),
('test-003-1', 'student-003', '2026-03-20 10:00:00', 10, 'Normal', 0.1500, '[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]'::jsonb),
('test-003-2', 'student-003', '2026-04-08 15:00:00', 11, 'Normal', 0.1800, '[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1]'::jsonb),
('test-004-1', 'student-004', '2026-03-25 09:30:00', 21, 'Ringan', 0.3500, '[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]'::jsonb),
('test-005-1', 'student-005', '2026-04-12 16:00:00', 63, 'Sangat Parah', 0.9500, '[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]'::jsonb),
('test-006-1', 'student-006', '2026-04-02 14:00:00', 52, 'Parah', 0.8000, '[3,2,3,2,2,3,2,3,3,2,3,2,2,3,2,3,2,3,2,3,2]'::jsonb),
('test-007-1', 'student-007', '2026-03-28 11:30:00', 31, 'Sedang', 0.5200, '[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2]'::jsonb),
('test-008-1', 'student-008', '2026-04-03 10:15:00', 9, 'Normal', 0.1200, '[0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0]'::jsonb),
('test-009-1', 'student-009', '2026-03-30 13:45:00', 19, 'Ringan', 0.3200, '[1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1]'::jsonb),
('test-010-1', 'student-010', '2026-04-06 09:00:00', 8, 'Normal', 0.1000, '[0,1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0]'::jsonb),
('test-011-1', 'student-011', '2026-04-01 15:20:00', 33, 'Sedang', 0.5800, '[2,2,1,2,1,2,2,1,2,1,2,1,2,2,1,2,1,2,1,2,1]'::jsonb),
('test-012-1', 'student-012', '2026-03-31 12:00:00', 17, 'Ringan', 0.2800, '[1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0]'::jsonb),
('test-013-1', 'student-013', '2026-04-04 11:15:00', 56, 'Parah', 0.8300, '[3,3,2,3,3,2,3,2,3,3,2,3,2,3,3,2,3,2,3,2,3]'::jsonb),
('test-014-1', 'student-014', '2026-03-22 14:30:00', 10, 'Normal', 0.1400, '[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]'::jsonb),
('test-015-1', 'student-015', '2026-04-07 10:45:00', 20, 'Ringan', 0.3300, '[1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,0]'::jsonb),
('test-016-1', 'student-016', '2026-03-26 13:00:00', 9, 'Normal', 0.1300, '[0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1]'::jsonb),
('test-017-1', 'student-017', '2026-04-09 11:45:00', 35, 'Sedang', 0.6000, '[2,1,2,2,1,2,1,2,2,1,2,2,1,2,1,2,2,1,2,1,2]'::jsonb),
('test-018-1', 'student-018', '2026-04-11 09:30:00', 8, 'Normal', 0.1100, '[0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0]'::jsonb),
('test-019-1', 'student-019', '2026-03-29 14:15:00', 18, 'Ringan', 0.3000, '[1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1]'::jsonb),
('test-020-1', 'student-020', '2026-04-13 15:45:00', 10, 'Normal', 0.1500, '[0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1]'::jsonb),
('test-623158a8', 'student-001', '2026-05-10 10:23:53', 20, 'Sedang', 2.0000, '[2,1,1,2,1,1,2,2,1,2,2,1,2,1,1,2,1,2,2,2,1]'::jsonb)
on conflict (test_id) do update set student_id = excluded.student_id, date = excluded.date, score = excluded.score, level = excluded.level, fuzzy_score = excluded.fuzzy_score, answers = excluded.answers;

commit;
