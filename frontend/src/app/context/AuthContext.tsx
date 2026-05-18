import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiUrl } from '../utils/api';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (apiUser: any) => User;
  register: (name: string, email: string, password: string, profile?: Partial<User>) => Promise<boolean>;
  startAsGuest: () => void;
  saveTestResult: (result: TestResult) => Promise<TestResult | null>;
  getTestHistory: () => TestResult[];
  getAllTestResults: () => Promise<any[]>;
  getAllStudents: () => Promise<any[]>;
  currentTestAnswers: number[];
  setCurrentTestAnswers: (answers: number[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
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

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'student') fetchTestHistory(parsedUser.id);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    if (token) {
      fetch(apiUrl('/auth/me'), {
        headers: getAuthHeaders()
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Token tidak valid');
          return res.json();
        })
        .then((data) => {
          if (!data.user) return;
          const freshUser = mapApiUser(data.user);
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
          if (freshUser.role === 'student') fetchTestHistory(freshUser.id);
        })
        .catch(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

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
      console.error("Gagal load history dari database", error);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.user) {
        const loggedInUser = mapApiUser(data.user);
        setUser(loggedInUser);
        setIsGuest(false);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('token', data.token);
        
        if (loggedInUser.role === 'student') fetchTestHistory(loggedInUser.id);
        return true;
      } else {
        console.error("Login Error:", data);
        alert(`Login gagal: ${data.message || 'Email atau password salah.'}`);
        return false;
      }
    } catch (error) {
      console.error("Network Error Login:", error);
      alert("Gagal terhubung ke backend. Pastikan URL API backend sudah benar.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    setTestHistory([]);
    setCurrentTestAnswers([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const register = async (name: string, email: string, password: string, profile: Partial<User> = {}): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'student',
          nim: profile.nim,
          nik: profile.nik,
          faculty: profile.faculty,
          major: profile.major,
          semester: profile.semester
        })
      });
      const data = await res.json();

      if (res.ok && data.user) {
        const registeredUser = mapApiUser(data.user);
        setUser(registeredUser);
        setIsGuest(false);
        localStorage.setItem('user', JSON.stringify(registeredUser));
        localStorage.setItem('token', data.token);
        if (registeredUser.role === 'student') fetchTestHistory(registeredUser.id);
        return true;
      }

      console.error("Register Error:", data);
      alert(`Pendaftaran gagal: ${data.message || 'Silakan cek terminal backend Anda untuk detail error MySQL'}`);
      return false;
    } catch (error) {
      console.error("Network Error Register:", error);
      alert("Gagal terhubung ke backend. Pastikan URL API backend sudah benar.");
      return false;
    }
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
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ student_id: user.id, answers: result.answers })
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

  const getTestHistory = useCallback(() => {
    return testHistory;
  }, [testHistory]);

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
      const res = await fetch(apiUrl('/students'), {
        headers: getAuthHeaders()
      });
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
        register,
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
