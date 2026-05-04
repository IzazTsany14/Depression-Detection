# Integration Guide - Frontend & Backend

Panduan lengkap mengintegrasikan React Frontend dengan Node.js Backend.

## Architecture Overview

```
┌─────────────────────┐
│   React Frontend    │ (localhost:5173)
│  ├── Components     │
│  ├── Pages          │
│  ├── AuthContext    │
│  └── API Services   │
└──────────┬──────────┘
           │ HTTP (JSON)
           │ Token in Header
           │ CORS enabled
           │
┌──────────▼──────────┐
│   Express Backend   │ (localhost:5000)
│  ├── Routes         │
│  ├── Controllers    │
│  ├── Services       │
│  └── Database       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  MySQL Database     │
│   (depresi)         │
└─────────────────────┘
```

## Setup Steps

### 1. Backend Must Running First

```bash
cd depression-detection/backend
pnpm dev
# Seharusnya: ✓ Server running di http://localhost:5000
```

### 2. Update Frontend Vite Config

File: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

### 3. Update AuthContext untuk Backend

File: `src/app/context/AuthContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  role: 'student' | 'bk' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Save to state and localStorage
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, role: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Register failed');
      }

      const data = await response.json();
      
      // Save to state and localStorage
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 4. Create API Service Utility

File: `src/app/utils/apiService.ts`

```typescript
const API_BASE_URL = '/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

export async function apiCall<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API call failed');
  }

  return response.json();
}

// Auth Services
export const authService = {
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: { email, password }
    }),

  register: (email: string, password: string, role: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: { email, password, role }
    }),

  getCurrentUser: () =>
    apiCall('/auth/me', { method: 'GET' }),

  logout: () =>
    apiCall('/auth/logout', { method: 'POST' })
};

// Test Services
export const testService = {
  submitTest: (student_id: number, answers: number[]) =>
    apiCall('/tests/submit', {
      method: 'POST',
      body: { student_id, answers }
    }),

  getTestsByStudent: (student_id: number) =>
    apiCall(`/tests/student/${student_id}`, { method: 'GET' }),

  getTestDetail: (test_id: string) =>
    apiCall(`/tests/detail/${test_id}`, { method: 'GET' }),

  getTestStatistics: (student_id: number) =>
    apiCall(`/tests/statistics/${student_id}`, { method: 'GET' }),

  deleteTest: (test_id: string) =>
    apiCall(`/tests/${test_id}`, { method: 'DELETE' })
};
```

### 5. Update Login Page

File: `src/app/pages/Login.tsx` (contoh)

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect based on role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'bk') {
        navigate('/bk/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### 6. Update Test Submission Page

File: `src/app/pages/Questionnaire.tsx` (contoh)

```typescript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { testService } from '../utils/apiService';
import { Button } from '../components/ui/button';

export default function Questionnaire() {
  const [answers, setAnswers] = useState<number[]>(new Array(21).fill(0));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      const response = await testService.submitTest(user.id, answers);
      setResult(response.testResult);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal submit test');
    }
  };

  if (submitted && result) {
    return (
      <div>
        <h2>Hasil Tes Anda</h2>
        <p>Level: {result.level}</p>
        <p>Skor: {result.score}</p>
        <p>{result.description}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>DASS-21 Questionnaire</h2>
      {/* Render 21 questions dengan answer selection */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Button onClick={handleSubmit}>Submit Test</Button>
    </div>
  );
}
```

### 7. Protected Routes

File: `src/app/routes.ts` (contoh)

```typescript
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }: any) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

// Usage in your router config:
// <Route element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
```

## Testing Integration

### 1. Start Backend
```bash
cd backend
pnpm dev
```

### 2. Start Frontend
```bash
cd .
pnpm dev
```

### 3. Test Flow

1. **Register** → POST `/api/auth/register`
2. **Login** → POST `/api/auth/login` (get token)
3. **Submit Test** → POST `/api/tests/submit`
4. **View Results** → GET `/api/tests/student/:id`

## Debugging Tips

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Submit form
4. Check request headers have `Authorization: Bearer <token>`

### Check LocalStorage
```javascript
// In browser console:
localStorage.getItem('authToken')
localStorage.getItem('user')
```

### Check Backend Logs
```
[timestamp] POST /api/auth/login
[timestamp] POST /api/tests/submit
...
```

## Common Issues

### CORS Error
- ✓ Backend sudah running di port 5000
- ✓ Frontend sudah running di port 5173
- ✓ Check app.js CORS configuration

### 401 Unauthorized
- ✓ Token missing di localStorage
- ✓ Token format: `Bearer <token>`
- ✓ Token sudah expired

### Database Error
- ✓ MySQL running
- ✓ Database `depresi` exists
- ✓ DB credentials di .env correct

## Production Deployment

When deploying to production:

1. **Backend**
   - Set `NODE_ENV=production`
   - Use strong JWT_SECRET
   - Setup environment variables securely
   - Use process manager (PM2)

2. **Frontend**
   - Change API_BASE_URL to production backend
   - Build for production: `pnpm build`
   - Deploy to hosting (Vercel, Netlify, etc)

3. **Database**
   - Backup regularly
   - Use strong passwords
   - Enable SSL for connections

## Checklist

- [ ] Backend running and accessible
- [ ] Frontend can reach backend API
- [ ] Login works and token is saved
- [ ] Test submission works
- [ ] Results display correctly
- [ ] Logout clears token
- [ ] Role-based routing works
- [ ] All endpoints return correct data
