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
  // Students
  {
    id: 'student-001',
    email: 'mahasiswa1@student.ac.id',
    password: 'student123',
    name: 'Ahmad Fauzi',
    role: 'student',
    nik: '3201051998123001',
    nim: '2021110001',
    faculty: 'Fakultas Ilmu Komputer',
    major: 'Teknik Informatika',
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
    faculty: 'Fakultas Ilmu Komputer',
    major: 'Sistem Informasi',
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
    faculty: 'Fakultas Teknik',
    major: 'Teknik Elektro',
    semester: 8
  },
  {
    id: 'student-004',
    email: 'mahasiswa4@student.ac.id',
    password: 'student123',
    name: 'Dewi Kusuma',
    role: 'student',
    nik: '3502031997456004',
    nim: '2022110030',
    faculty: 'Fakultas Psikologi',
    major: 'Psikologi',
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
    faculty: 'Fakultas Ekonomi',
    major: 'Manajemen',
    semester: 6
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
