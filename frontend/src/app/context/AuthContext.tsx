import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  accountId?: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'bk';
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
  register: (name: string, email: string, password: string) => Promise<boolean>;
  startAsGuest: () => void;
  saveTestResult: (result: TestResult) => void;
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

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const mapApiUser = (apiUser: any): User => ({
    id: String(apiUser.id || apiUser.student_id || apiUser.bk_id || apiUser.admin_id || apiUser.account_id),
    accountId: apiUser.accountId || apiUser.account_id,
    name: apiUser.name || apiUser.email,
    email: apiUser.email,
    role: apiUser.role,
    nik: apiUser.nik || undefined,
    nim: apiUser.nim || undefined,
    nip: apiUser.nip || undefined,
    nidn: apiUser.nidn || undefined,
    nuptk: apiUser.nuptk || undefined,
    faculty: apiUser.faculty || undefined,
    major: apiUser.major || undefined,
    semester: apiUser.semester || undefined,
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

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
      fetch(`${API_URL}/auth/me`, {
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

  const fetchTestHistory = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/tests/student/${userId}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setTestHistory(data.data || data.results || []);
      }
    } catch (error) {
      console.error("Gagal load history dari database", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
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
      alert("Gagal terhubung ke backend. Pastikan terminal server backend berjalan di port 5000.");
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

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Generate NIM & NIK otomatis karena MySQL mewajibkan kolom nim (NOT NULL)
      const autoNim = Math.floor(Math.random() * 10000000000).toString();

      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'student', nim: autoNim })
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
      alert("Gagal terhubung ke backend. Pastikan terminal server backend berjalan di port 5000.");
      return false;
    }
  };

  const startAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const saveTestResult = (result: TestResult) => {
    if (user && !isGuest) {
      fetch(`${API_URL}/tests/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ student_id: user.id, answers: result.answers })
      }).then(() => fetchTestHistory(user.id));
    }
  };

  const getTestHistory = () => {
    return testHistory;
  };

  const getAllTestResults = async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_URL}/tests`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const getAllStudents = async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_URL}/students`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        login,
        logout,
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
