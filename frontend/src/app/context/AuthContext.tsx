import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiUrl, fetchWithTimeout } from '../utils/api';

interface User {
  id: string;
  accountId?: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'bk';
  profile_picture?: string | null;
  profilePicture?: string | null;
  profileUpdatedAt?: number;
  nik?: string;
  nim?: string;
  nip?: string;
  nidn?: string;
  nuptk?: string;
  faculty?: string;
  major?: string;
  semester?: number;
}

interface TestResult {
  id: string;
  date: string;
  score: number;
  level: string;
  answers: number[];
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  updateUser: (apiUser: any) => User;
  startAsGuest: () => void;
  saveTestResult: (result: TestResult) => Promise<TestResult | null>;
  getTestHistory: () => TestResult[];
  getAllTestResults: () => Promise<any[]>;
  getAllStudents: () => Promise<any[]>;
  currentTestAnswers: number[];
  setCurrentTestAnswers: (answers: number[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const sensitiveLocalStorageKeys = [
  'user',
  'token',
  'medicalRecords',
  'registeredUsers',
  'adminAddedUsers',
  'passwordResets',
  'resetTokens',
  'dummyDataInitialized',
  'counselingSessions'
];

const clearSensitiveLocalStorage = () => {
  sensitiveLocalStorageKeys.forEach((key) => localStorage.removeItem(key));
  Object.keys(localStorage)
    .filter((key) => key.startsWith('history_'))
    .forEach((key) => localStorage.removeItem(key));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [currentTestAnswers, setCurrentTestAnswers] = useState<number[]>([]);

  const mapApiUser = (apiUser: any): User => ({
    id: String(apiUser.id || apiUser.student_id || apiUser.bk_id || apiUser.admin_id || apiUser.account_id),
    accountId: apiUser.accountId || apiUser.account_id,
    name: apiUser.name || apiUser.email,
    email: apiUser.email,
    role: apiUser.role,
    profile_picture: apiUser.profile_picture ?? apiUser.profilePicture ?? null,
    profilePicture: apiUser.profilePicture ?? apiUser.profile_picture ?? null,
    nik: apiUser.nik || undefined,
    nim: apiUser.nim || undefined,
    nip: apiUser.nip || undefined,
    nidn: apiUser.nidn || undefined,
    nuptk: apiUser.nuptk || undefined,
    faculty: apiUser.faculty || undefined,
    major: apiUser.major || undefined,
    semester: apiUser.semester || undefined,
  });

  const updateUser = useCallback((apiUser: any): User => {
    const updatedUser = {
      ...mapApiUser(apiUser),
      profileUpdatedAt: Date.now()
    };
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const normalizeAnswers = (answers: any): number[] => {
    if (Array.isArray(answers)) return answers;
    if (typeof answers === 'string') {
      try {
        const parsed = JSON.parse(answers);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const mapApiTestResult = (test: any): TestResult & Record<string, any> => ({
    ...test,
    id: String(test.id || test.test_id),
    userId: test.userId || test.student_id,
    userName: test.userName || test.name || test.student_name,
    userEmail: test.userEmail || test.email,
    date: test.date,
    score: Number(test.score || 0),
    level: test.level,
    answers: normalizeAnswers(test.answers),
  });

  const fetchTestHistory = useCallback(async (userId: string) => {
    try {
      const res = await fetch(apiUrl(`/tests/student/${userId}`), {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        const mappedHistory = (data.data || data.results || [])
          .map(mapApiTestResult)
          .sort((a: TestResult, b: TestResult) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setTestHistory(mappedHistory);
      }
    } catch (error) {
      console.error('Gagal load history dari database', error);
    }
  }, []);

  useEffect(() => {
    clearSensitiveLocalStorage();
    const token = sessionStorage.getItem('token');

    if (token) {
      fetch(apiUrl('/auth/me'), { headers: getAuthHeaders() })
        .then(async (res) => {
          if (!res.ok) throw new Error('Token tidak valid');
          return res.json();
        })
        .then((data) => {
          if (!data.user) return;
          const freshUser = mapApiUser(data.user);
          setUser(freshUser);
          if (freshUser.role === 'student') fetchTestHistory(freshUser.id);
        })
        .catch(() => {
          sessionStorage.removeItem('token');
          setUser(null);
        });
    }
  }, [fetchTestHistory]);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await fetchWithTimeout(apiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }, 15000);
      const data = await res.json();

      if (res.ok && data.user) {
        const loggedInUser = mapApiUser(data.user);
        setUser(loggedInUser);
        setIsGuest(false);
        clearSensitiveLocalStorage();
        sessionStorage.setItem('token', data.token);
        if (loggedInUser.role === 'student') fetchTestHistory(loggedInUser.id);
        return loggedInUser;
      }

      console.error('Login Error:', data);
      alert(`Login gagal: ${data.message || 'Email atau password salah.'}`);
      return null;
    } catch (error) {
      console.error('Network Error Login:', error);
      alert('Gagal terhubung ke backend. Pastikan URL API backend sudah benar dan backend Railway sudah aktif.');
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    setTestHistory([]);
    setCurrentTestAnswers([]);
    sessionStorage.removeItem('token');
    clearSensitiveLocalStorage();
  };

  const startAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const saveTestResult = async (result: TestResult): Promise<TestResult | null> => {
    if (user && !isGuest) {
      const res = await fetch(apiUrl('/tests/submit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ answers: result.answers })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Gagal menyimpan hasil tes');
      }

      const savedResult = mapApiTestResult({
        ...data.testResult,
        id: data.testResult?.test_id,
        test_id: data.testResult?.test_id,
        date: data.testResult?.timestamp || result.date,
        answers: result.answers
      });

      setTestHistory(prev => [...prev, savedResult].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      fetchTestHistory(user.id);
      return savedResult;
    }

    return null;
  };

  const getTestHistory = useCallback(() => testHistory, [testHistory]);

  const getAllTestResults = useCallback(async (): Promise<any[]> => {
    try {
      const res = await fetch(apiUrl(`/tests?_=${Date.now()}`), {
        cache: 'no-store',
        headers: {
          ...getAuthHeaders(),
          'Cache-Control': 'no-cache',
        }
      });
      const data = await res.json();
      return (data.data || []).map(mapApiTestResult);
    } catch (e) {
      console.error(e);
      return [];
    }
  }, []);

  const getAllStudents = useCallback(async (): Promise<any[]> => {
    try {
      const res = await fetch(apiUrl('/history_students'), { headers: getAuthHeaders() });
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        login,
        logout,
        updateUser,
        startAsGuest,
        saveTestResult,
        getTestHistory,
        getAllTestResults,
        getAllStudents,
        currentTestAnswers,
        setCurrentTestAnswers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
