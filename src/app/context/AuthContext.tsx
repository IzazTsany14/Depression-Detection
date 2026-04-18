import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyUsers, dummyTestResults, authenticateUser } from '../data/dummyData';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'bk';
  npm?: string;
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
      localStorage.setItem('registeredUsers', JSON.stringify(dummyUsers));
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
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // Load test history for students only
      if (parsedUser.role === 'student') {
        const userHistory = JSON.parse(localStorage.getItem(`history_${parsedUser.id}`) || '[]');
        setTestHistory(userHistory);
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
        npm: foundUser.npm,
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
    // Mock registration
    const mockUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Check if email already exists
    if (mockUsers.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: 'student' as const,
    };

    mockUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(mockUsers));

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
