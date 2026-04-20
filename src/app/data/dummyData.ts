// Dummy Data untuk Sistem Deteksi Depresi

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'student' | 'admin' | 'bk';
  nik?: string; // Nomor Induk Kependudukan
  nim?: string; // Nomor Induk Mahasiswa
  nip?: string; // Nomor Induk Pegawai
  nidn?: string; // Nomor Induk Dosen Nasional
  nuptk?: string; // Nomor Unik Pendidik dan Tenaga Kependidikan
  faculty?: string;
  major?: string;
  semester?: number;
}

export interface TestResult {
  userId: string;
  testId: string;
  date: string;
  answers: number[];
  score: number;
  level: string;
  fuzzyScore: number;
}

// Dummy Users
export const dummyUsers: User[] = [
  // Admin
  {
    id: 'admin-001',
    email: 'admin@university.ac.id',
    password: 'admin123',
    name: 'Dr. Admin Sistem',
    role: 'admin'
  },
  // BK (Bimbingan Konseling)
  {
    id: 'bk-001',
    email: 'bk@university.ac.id',
    password: 'bk123',
    name: 'Psikolog Budi Santoso, M.Psi',
    role: 'bk'
  },
  {
    id: 'bk-002',
    email: 'bk2@university.ac.id',
    password: 'bk123',
    name: 'Dr. Siti Nurhaliza, M.Psi',
    role: 'bk'
  },
  // Students - Fisipol (Fakultas Ilmu Sosial dan Ilmu Politik)
  {
    id: 'student-001',
    email: 'mahasiswa1@student.ac.id',
    password: 'student123',
    name: 'Ahmad Fauzi',
    role: 'student',
    nik: '3201051998123001',
    nim: '2021110001',
    faculty: 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)',
    major: 'Ilmu Administrasi',
    semester: 6
  },
  {
    id: 'student-002',
    email: 'mahasiswa2@student.ac.id',
    password: 'student123',
    name: 'Siti Rahmawati',
    role: 'student',
    nik: '3206021999234002',
    nim: '2021110002',
    faculty: 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)',
    major: 'Ilmu Komunikasi',
    semester: 6
  },
  {
    id: 'student-003',
    email: 'mahasiswa3@student.ac.id',
    password: 'student123',
    name: 'Budi Hartono',
    role: 'student',
    nik: '3571021996345003',
    nim: '2020110015',
    faculty: 'Fakultas Ilmu Sosial dan Ilmu Politik (Fisipol)',
    major: 'Ilmu Politik',
    semester: 8
  },
  // FEB (Fakultas Ekonomi dan Bisnis)
  {
    id: 'student-004',
    email: 'mahasiswa4@student.ac.id',
    password: 'student123',
    name: 'Dewi Kusuma',
    role: 'student',
    nik: '3502031997456004',
    nim: '2022110030',
    faculty: 'Fakultas Ekonomi dan Bisnis (FEB)',
    major: 'Akuntansi',
    semester: 4
  },
  {
    id: 'student-005',
    email: 'mahasiswa5@student.ac.id',
    password: 'student123',
    name: 'Eko Prasetyo',
    role: 'student',
    nik: '3514121995567005',
    nim: '2021110045',
    faculty: 'Fakultas Ekonomi dan Bisnis (FEB)',
    major: 'Manajemen',
    semester: 6
  },
  {
    id: 'student-006',
    email: 'mahasiswa6@student.ac.id',
    password: 'student123',
    name: 'Ratna Wijaya',
    role: 'student',
    nik: '3301011997123456',
    nim: '2021110046',
    faculty: 'Fakultas Ekonomi dan Bisnis (FEB)',
    major: 'Ekonomi Pembangunan',
    semester: 5
  },
  // FT (Fakultas Teknik)
  {
    id: 'student-007',
    email: 'mahasiswa7@student.ac.id',
    password: 'student123',
    name: 'Hendra Gunawan',
    role: 'student',
    nik: '3406021996234567',
    nim: '2021110050',
    faculty: 'Fakultas Teknik (FT)',
    major: 'Teknik Informatika',
    semester: 6
  },
  {
    id: 'student-008',
    email: 'mahasiswa8@student.ac.id',
    password: 'student123',
    name: 'Indah Sulistyo',
    role: 'student',
    nik: '3502121997345678',
    nim: '2021110051',
    faculty: 'Fakultas Teknik (FT)',
    major: 'Teknik Elektro',
    semester: 6
  },
  {
    id: 'student-009',
    email: 'mahasiswa9@student.ac.id',
    password: 'student123',
    name: 'Joko Pambudi',
    role: 'student',
    nik: '3211231996456789',
    nim: '2020110060',
    faculty: 'Fakultas Teknik (FT)',
    major: 'Teknik Sipil',
    semester: 8
  },
  {
    id: 'student-010',
    email: 'mahasiswa10@student.ac.id',
    password: 'student123',
    name: 'Kimberly Tan',
    role: 'student',
    nik: '3601121997567890',
    nim: '2022110070',
    faculty: 'Fakultas Teknik (FT)',
    major: 'Teknik Mesin',
    semester: 4
  },
  // FV (Fakultas Vokasi)
  {
    id: 'student-011',
    email: 'mahasiswa11@student.ac.id',
    password: 'student123',
    name: 'Lina Marlina',
    role: 'student',
    nik: '3701051998678901',
    nim: '2021110080',
    faculty: 'Fakultas Vokasi (FV)',
    major: 'D3 Perhotelan',
    semester: 5
  },
  {
    id: 'student-012',
    email: 'mahasiswa12@student.ac.id',
    password: 'student123',
    name: 'Maulana Rizki',
    role: 'student',
    nik: '3302061998789012',
    nim: '2021110081',
    faculty: 'Fakultas Vokasi (FV)',
    major: 'D3 Pariwisata',
    semester: 5
  },
  // FH (Fakultas Hukum)
  {
    id: 'student-013',
    email: 'mahasiswa13@student.ac.id',
    password: 'student123',
    name: 'Nanda Pratama',
    role: 'student',
    nik: '3401121997890123',
    nim: '2021110090',
    faculty: 'Fakultas Hukum (FH)',
    major: 'Ilmu Hukum',
    semester: 6
  },
  {
    id: 'student-014',
    email: 'mahasiswa14@student.ac.id',
    password: 'student123',
    name: 'Okta Permana',
    role: 'student',
    nik: '3502181996901234',
    nim: '2020110100',
    faculty: 'Fakultas Hukum (FH)',
    major: 'Ilmu Hukum',
    semester: 8
  },
  // FMIPA (Fakultas Matematika dan Ilmu Pengetahuan Alam)
  {
    id: 'student-015',
    email: 'mahasiswa15@student.ac.id',
    password: 'student123',
    name: 'Priya Santoso',
    role: 'student',
    nik: '3301051998012345',
    nim: '2021110110',
    faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
    major: 'Matematika',
    semester: 6
  },
  {
    id: 'student-016',
    email: 'mahasiswa16@student.ac.id',
    password: 'student123',
    name: 'Quentin Ridho',
    role: 'student',
    nik: '3401101997123456',
    nim: '2021110111',
    faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
    major: 'Fisika',
    semester: 6
  },
  {
    id: 'student-017',
    email: 'mahasiswa17@student.ac.id',
    password: 'student123',
    name: 'Rina Dwi',
    role: 'student',
    nik: '3502111996234567',
    nim: '2021110112',
    faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
    major: 'Kimia',
    semester: 6
  },
  {
    id: 'student-018',
    email: 'mahasiswa18@student.ac.id',
    password: 'student123',
    name: 'Sinta Nurma',
    role: 'student',
    nik: '3601201997345678',
    nim: '2022110120',
    faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
    major: 'Biologi',
    semester: 4
  },
  // Fakultas PSDKU
  {
    id: 'student-019',
    email: 'mahasiswa19@student.ac.id',
    password: 'student123',
    name: 'Toni Suryanto',
    role: 'student',
    nik: '3402081996456789',
    nim: '2021110130',
    faculty: 'Fakultas PSDKU',
    major: 'Manajemen Pariwisata',
    semester: 6
  },
  {
    id: 'student-020',
    email: 'mahasiswa20@student.ac.id',
    password: 'student123',
    name: 'Ulfah Karina',
    role: 'student',
    nik: '3503151998567890',
    nim: '2022110140',
    faculty: 'Fakultas PSDKU',
    major: 'Manajemen Pariwisata',
    semester: 4
  }
];

// Dummy Test Results untuk mahasiswa
export const dummyTestResults: TestResult[] = [
  // Ahmad Fauzi - student-001 (Depresi Berat - perlu perhatian BK)
  {
    userId: 'student-001',
    testId: 'test-001-1',
    date: '2026-03-01T10:30:00',
    answers: [3, 3, 2, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3],
    score: 54,
    level: 'Berat',
    fuzzyScore: 0.85
  },
  {
    userId: 'student-001',
    testId: 'test-001-2',
    date: '2026-04-01T09:15:00',
    answers: [3, 2, 3, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 2],
    score: 51,
    level: 'Berat',
    fuzzyScore: 0.82
  },
  {
    userId: 'student-001',
    testId: 'test-001-3',
    date: '2026-04-10T14:20:00',
    answers: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    score: 42,
    level: 'Sedang',
    fuzzyScore: 0.68
  },

  // Siti Rahmawati - student-002 (Depresi Sedang - monitoring)
  {
    userId: 'student-002',
    testId: 'test-002-1',
    date: '2026-03-15T11:00:00',
    answers: [2, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    score: 32,
    level: 'Sedang',
    fuzzyScore: 0.55
  },
  {
    userId: 'student-002',
    testId: 'test-002-2',
    date: '2026-04-05T13:30:00',
    answers: [1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2],
    score: 28,
    level: 'Ringan',
    fuzzyScore: 0.45
  },

  // Budi Hartono - student-003 (Normal - tidak perlu intervensi)
  {
    userId: 'student-003',
    testId: 'test-003-1',
    date: '2026-03-20T10:00:00',
    answers: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    score: 10,
    level: 'Normal',
    fuzzyScore: 0.15
  },
  {
    userId: 'student-003',
    testId: 'test-003-2',
    date: '2026-04-08T15:00:00',
    answers: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    score: 11,
    level: 'Normal',
    fuzzyScore: 0.18
  },

  // Dewi Kusuma - student-004 (Ringan - early warning)
  {
    userId: 'student-004',
    testId: 'test-004-1',
    date: '2026-03-25T09:30:00',
    answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    score: 21,
    level: 'Ringan',
    fuzzyScore: 0.35
  },

  // Eko Prasetyo - student-005 (Sangat Berat - urgent)
  {
    userId: 'student-005',
    testId: 'test-005-1',
    date: '2026-04-12T16:00:00',
    answers: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    score: 63,
    level: 'Sangat Berat',
    fuzzyScore: 0.95
  },

  // Ratna Wijaya - student-006 (Berat - perlu perhatian)
  {
    userId: 'student-006',
    testId: 'test-006-1',
    date: '2026-04-02T14:00:00',
    answers: [3, 2, 3, 2, 2, 3, 2, 3, 3, 2, 3, 2, 2, 3, 2, 3, 2, 3, 2, 3, 2],
    score: 52,
    level: 'Berat',
    fuzzyScore: 0.80
  },

  // Hendra Gunawan - student-007 (Sedang - monitoring)
  {
    userId: 'student-007',
    testId: 'test-007-1',
    date: '2026-03-28T11:30:00',
    answers: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    score: 31,
    level: 'Sedang',
    fuzzyScore: 0.52
  },

  // Indah Sulistyo - student-008 (Normal)
  {
    userId: 'student-008',
    testId: 'test-008-1',
    date: '2026-04-03T10:15:00',
    answers: [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
    score: 9,
    level: 'Normal',
    fuzzyScore: 0.12
  },

  // Joko Pambudi - student-009 (Ringan)
  {
    userId: 'student-009',
    testId: 'test-009-1',
    date: '2026-03-30T13:45:00',
    answers: [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    score: 19,
    level: 'Ringan',
    fuzzyScore: 0.32
  },

  // Kimberly Tan - student-010 (Normal)
  {
    userId: 'student-010',
    testId: 'test-010-1',
    date: '2026-04-06T09:00:00',
    answers: [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
    score: 8,
    level: 'Normal',
    fuzzyScore: 0.10
  },

  // Lina Marlina - student-011 (Sedang)
  {
    userId: 'student-011',
    testId: 'test-011-1',
    date: '2026-04-01T15:20:00',
    answers: [2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
    score: 33,
    level: 'Sedang',
    fuzzyScore: 0.58
  },

  // Maulana Rizki - student-012 (Ringan)
  {
    userId: 'student-012',
    testId: 'test-012-1',
    date: '2026-03-31T12:00:00',
    answers: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
    score: 17,
    level: 'Ringan',
    fuzzyScore: 0.28
  },

  // Nanda Pratama - student-013 (Berat)
  {
    userId: 'student-013',
    testId: 'test-013-1',
    date: '2026-04-04T11:15:00',
    answers: [3, 3, 2, 3, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3, 2, 3],
    score: 56,
    level: 'Berat',
    fuzzyScore: 0.83
  },

  // Okta Permana - student-014 (Normal)
  {
    userId: 'student-014',
    testId: 'test-014-1',
    date: '2026-03-22T14:30:00',
    answers: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    score: 10,
    level: 'Normal',
    fuzzyScore: 0.14
  },

  // Priya Santoso - student-015 (Ringan)
  {
    userId: 'student-015',
    testId: 'test-015-1',
    date: '2026-04-07T10:45:00',
    answers: [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
    score: 20,
    level: 'Ringan',
    fuzzyScore: 0.33
  },

  // Quentin Ridho - student-016 (Normal)
  {
    userId: 'student-016',
    testId: 'test-016-1',
    date: '2026-03-26T13:00:00',
    answers: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    score: 9,
    level: 'Normal',
    fuzzyScore: 0.13
  },

  // Rina Dwi - student-017 (Sedang - monitoring)
  {
    userId: 'student-017',
    testId: 'test-017-1',
    date: '2026-04-09T11:45:00',
    answers: [2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2],
    score: 35,
    level: 'Sedang',
    fuzzyScore: 0.60
  },

  // Sinta Nurma - student-018 (Normal)
  {
    userId: 'student-018',
    testId: 'test-018-1',
    date: '2026-04-11T09:30:00',
    answers: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0],
    score: 8,
    level: 'Normal',
    fuzzyScore: 0.11
  },

  // Toni Suryanto - student-019 (Ringan)
  {
    userId: 'student-019',
    testId: 'test-019-1',
    date: '2026-03-29T14:15:00',
    answers: [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1],
    score: 18,
    level: 'Ringan',
    fuzzyScore: 0.30
  },

  // Ulfah Karina - student-020 (Normal)
  {
    userId: 'student-020',
    testId: 'test-020-1',
    date: '2026-04-13T15:45:00',
    answers: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    score: 10,
    level: 'Normal',
    fuzzyScore: 0.15
  }
];

// Statistik untuk Admin Dashboard
export const getStatistics = () => {
  const totalStudents = dummyUsers.filter(u => u.role === 'student').length;
  const totalTests = dummyTestResults.length;
  const latestResults = dummyTestResults.filter(r => {
    const testDate = new Date(r.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return testDate >= thirtyDaysAgo;
  });

  const levelCounts = latestResults.reduce((acc, result) => {
    acc[result.level] = (acc[result.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalStudents,
    totalTests,
    totalBK: dummyUsers.filter(u => u.role === 'bk').length,
    activeTests: latestResults.length,
    levelDistribution: levelCounts,
    criticalCases: dummyTestResults.filter(r =>
      r.level === 'Berat' || r.level === 'Sangat Berat'
    ).length
  };
};

// Data untuk BK Dashboard - mahasiswa yang perlu perhatian
export const getStudentsNeedingAttention = () => {
  const criticalStudentIds = new Set(
    dummyTestResults
      .filter(r => r.level === 'Berat' || r.level === 'Sangat Berat')
      .map(r => r.userId)
  );

  return dummyUsers
    .filter(u => u.role === 'student' && criticalStudentIds.has(u.id))
    .map(student => {
      const studentTests = dummyTestResults
        .filter(t => t.userId === student.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const latestTest = studentTests[0];

      return {
        ...student,
        latestTest,
        testHistory: studentTests,
        totalTests: studentTests.length,
        trend: studentTests.length > 1
          ? (studentTests[0].score < studentTests[1].score ? 'improving' : 'worsening')
          : 'new'
      };
    });
};

// Search helper - mencari mahasiswa berdasarkan NIK, NIM, atau nama
export const searchStudents = (query: string) => {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    return [];
  }

  return dummyUsers.filter(u => {
    if (u.role !== 'student') return false;
    
    return (
      (u.nik && u.nik.includes(searchTerm)) ||
      (u.nim && u.nim.includes(searchTerm)) ||
      (u.name && u.name.toLowerCase().includes(searchTerm))
    );
  });
};

// Cari dan ambil detail student dengan test history
export const getStudentDetailBySearch = (query: string) => {
  const students = searchStudents(query);
  
  return students.map(student => {
    const studentTests = dummyTestResults
      .filter(t => t.userId === student.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const latestTest = studentTests[0];

    return {
      ...student,
      latestTest,
      testHistory: studentTests,
      totalTests: studentTests.length,
      trend: studentTests.length > 1
        ? (studentTests[0].score < studentTests[1].score ? 'improving' : 'worsening')
        : 'new'
    };
  });
};

// Login helper
export const authenticateUser = (email: string, password: string) => {
  // Check from localStorage first (realtime data)
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  return registeredUsers.find((u: any) => u.email === email && u.password === password);
};
