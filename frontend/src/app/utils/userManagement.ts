// Real-time User Management Utility
import { User } from '../data/dummyData';

interface UserWithPassword extends User {
  password: string;
}

/**
 * Get all users dari semua sumber (registered, admin-added)
 * Real-time dari localStorage
 */
export const getAllUsersRealtime = (): UserWithPassword[] => {
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');
  
  // Gabungkan dan remove duplicates
  const allUsers = [...registeredUsers, ...adminUsers];
  const userMap = new Map<string, UserWithPassword>();
  
  allUsers.forEach(user => {
    if (!userMap.has(user.id)) {
      userMap.set(user.id, user);
    }
  });
  
  return Array.from(userMap.values());
};

/**
 * Get users by role
 */
export const getUsersByRole = (role: 'student' | 'admin' | 'bk'): UserWithPassword[] => {
  return getAllUsersRealtime().filter(u => u.role === role);
};

/**
 * Add new user dari admin
 */
export const addNewUser = (user: UserWithPassword): { success: boolean; message: string } => {
  try {
    const allUsers = getAllUsersRealtime();
    
    // Check email duplication
    if (allUsers.some(u => u.email === user.email)) {
      return { success: false, message: 'Email sudah terdaftar' };
    }
    
    // Check ID duplication
    if (allUsers.some(u => u.id === user.id)) {
      return { success: false, message: 'User ID sudah ada' };
    }
    
    const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');
    
    const newUser: UserWithPassword = {
      ...user,
      id: user.id || `user_${Date.now()}`,
      password: user.password || 'password123'
    };
    
    adminUsers.push(newUser);
    localStorage.setItem('adminAddedUsers', JSON.stringify(adminUsers));
    
    return { success: true, message: 'User berhasil ditambahkan' };
  } catch (error) {
    return { success: false, message: 'Gagal menambahkan user' };
  }
};

/**
 * Update user existing
 */
export const updateUserData = (userId: string, updatedData: Partial<UserWithPassword>): { success: boolean; message: string } => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');
    
    // Cari di registered users
    const registeredIndex = registeredUsers.findIndex((u: any) => u.id === userId);
    if (registeredIndex !== -1) {
      registeredUsers[registeredIndex] = { ...registeredUsers[registeredIndex], ...updatedData };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      return { success: true, message: 'User berhasil diupdate' };
    }
    
    // Cari di admin users
    const adminIndex = adminUsers.findIndex((u: any) => u.id === userId);
    if (adminIndex !== -1) {
      adminUsers[adminIndex] = { ...adminUsers[adminIndex], ...updatedData };
      localStorage.setItem('adminAddedUsers', JSON.stringify(adminUsers));
      return { success: true, message: 'User berhasil diupdate' };
    }
    
    return { success: false, message: 'User tidak ditemukan' };
  } catch (error) {
    return { success: false, message: 'Gagal mengupdate user' };
  }
};

/**
 * Delete user
 */
export const deleteUser = (userId: string): { success: boolean; message: string } => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');
    
    // Cari dan hapus di registered users
    const registeredIndex = registeredUsers.findIndex((u: any) => u.id === userId);
    if (registeredIndex !== -1) {
      registeredUsers.splice(registeredIndex, 1);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      localStorage.removeItem(`history_${userId}`);
      return { success: true, message: 'User berhasil dihapus' };
    }
    
    // Cari dan hapus di admin users
    const adminIndex = adminUsers.findIndex((u: any) => u.id === userId);
    if (adminIndex !== -1) {
      adminUsers.splice(adminIndex, 1);
      localStorage.setItem('adminAddedUsers', JSON.stringify(adminUsers));
      localStorage.removeItem(`history_${userId}`);
      return { success: true, message: 'User berhasil dihapus' };
    }
    
    return { success: false, message: 'User tidak ditemukan' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus user' };
  }
};

/**
 * Search user by email, name, or ID
 */
export const searchUser = (query: string): UserWithPassword[] => {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    return [];
  }
  
  return getAllUsersRealtime().filter(u =>
    (u.email && u.email.toLowerCase().includes(searchTerm)) ||
    (u.name && u.name.toLowerCase().includes(searchTerm)) ||
    (u.id && u.id.toLowerCase().includes(searchTerm)) ||
    (u.nim && u.nim && u.nim.includes(searchTerm)) ||
    (u.nik && u.nik && u.nik.includes(searchTerm))
  );
};

/**
 * Get user by email
 */
export const getUserByEmail = (email: string): UserWithPassword | undefined => {
  return getAllUsersRealtime().find(u => u.email === email);
};

/**
 * Get user by ID
 */
export const getUserById = (userId: string): UserWithPassword | undefined => {
  return getAllUsersRealtime().find(u => u.id === userId);
};

/**
 * Get student stats untuk dashboard
 */
export const getStudentStats = () => {
  const students = getUsersByRole('student');
  const allTestResults: any[] = [];
  
  students.forEach(student => {
    const history = JSON.parse(localStorage.getItem(`history_${student.id}`) || '[]');
    history.forEach((test: any) => {
      allTestResults.push({
        ...test,
        userId: student.id,
        userName: student.name
      });
    });
  });
  
  const levelCounts = allTestResults.reduce((acc, result) => {
    acc[result.level] = (acc[result.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalStudents: students.length,
    totalTests: allTestResults.length,
    levelDistribution: levelCounts,
    criticalCases: allTestResults.filter(r =>
      r.level === 'Berat' || r.level === 'Sangat Berat'
    ).length
  };
};

/**
 * Initialize system dengan data dummy jika belum ada
 */
export const initializeSystem = () => {
  if (!localStorage.getItem('dummyDataInitialized')) {
    // System sudah di-initialize di AuthContext, tidak perlu di-init ulang
    return;
  }
};

export default {
  getAllUsersRealtime,
  getUsersByRole,
  addNewUser,
  updateUserData,
  deleteUser,
  searchUser,
  getUserByEmail,
  getUserById,
  getStudentStats
};
