import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyUsers, dummyTestResults, authenticateUser } from '../data/dummyData';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'bk';
  nik?: string;
  nim?: string;
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
  getAllTestResults: () => any[];
  currentTestAnswers: number[];
  setCurrentTestAnswers: (answers: number[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [currentTestAnswers, setCurrentTestAnswers] = useState<number[]>([]);

  // Load user from localStorage on mount and initialize dummy data
  useEffect(() => {
    // Initialize dummy data in localStorage if not exists
    if (!localStorage.getItem('dummyDataInitialized')) {
      // Pastikan registeredUsers berisi dummyUsers dengan password yang sudah ada
      const dummyUsersWithPassword = dummyUsers.map(user => ({
        ...user,
        password: user.password || 'defaultPassword123'
      }));
      
      localStorage.setItem('registeredUsers', JSON.stringify(dummyUsersWithPassword));
      localStorage.setItem('adminAddedUsers', JSON.stringify([])); // Initialize empty admin-added users
      localStorage.setItem('allTestResults', JSON.stringify(dummyTestResults));
      localStorage.setItem('dummyDataInitialized', 'true');

      // Store test results for each user
      dummyTestResults.forEach(result => {
        const userHistory = dummyTestResults.filter(r => r.userId === result.userId);
        localStorage.setItem(`history_${result.userId}`, JSON.stringify(userHistory));
      });
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Load test history for students only
        if (parsedUser.role === 'student') {
          const userHistory = JSON.parse(localStorage.getItem(`history_${parsedUser.id}`) || '[]');
          setTestHistory(userHistory);
        }
      } catch (e) {
        console.error('Failed to parse saved user:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Authenticate using dummy data
    const foundUser = authenticateUser(email, password);

    if (foundUser) {
      const loggedInUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        nik: foundUser.nik,
        nim: foundUser.nim,
        faculty: foundUser.faculty,
        major: foundUser.major,
        semester: foundUser.semester
      };

      setUser(loggedInUser);
      setIsGuest(false);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      // Load test history for students only
      if (foundUser.role === 'student') {
        const userHistory = JSON.parse(localStorage.getItem(`history_${foundUser.id}`) || '[]');
        setTestHistory(userHistory);
      }

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    setTestHistory([]);
    setCurrentTestAnswers([]);
    localStorage.removeItem('user');
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check dari registered users dan admin users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');

    // Check if email already exists di kedua tempat
    const allUsers = [...registeredUsers, ...adminUsers];
    if (allUsers.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: 'student_' + Date.now().toString(),
      name,
      email,
      password,
      role: 'student' as const,
    };

    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Initialize test history untuk user baru
    localStorage.setItem(`history_${newUser.id}`, JSON.stringify([]));

    // Auto login after registration
    const loggedInUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
    setUser(loggedInUser);
    setIsGuest(false);
    localStorage.setItem('user', JSON.stringify(loggedInUser));

    return true;
  };

  const startAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const saveTestResult = (result: TestResult) => {
    if (user && !isGuest) {
      const updatedHistory = [...testHistory, result];
      setTestHistory(updatedHistory);
      localStorage.setItem(`history_${user.id}`, JSON.stringify(updatedHistory));
      localStorage.setItem('testHistory', JSON.stringify(updatedHistory));
    }
  };

  const getTestHistory = () => {
    return testHistory;
  };

  const getAllTestResults = () => {
    // Get all test results from localStorage across all users (registered + admin-added)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');
    const allUsers = [...registeredUsers, ...adminUsers];
    const allResults: any[] = [];

    allUsers.forEach((u: any) => {
      const userHistory = JSON.parse(localStorage.getItem(`history_${u.id}`) || '[]');
      userHistory.forEach((test: any) => {
        allResults.push({
          ...test,
          userId: u.id,
          userName: u.name,
          userEmail: u.email,
          userRole: u.role
        });
      });
    });

    return allResults;
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
