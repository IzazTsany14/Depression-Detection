// User management now runs through backend admin APIs.
// This module is kept only for older imports and intentionally does not persist user data in browser storage.

export interface User {
  id: string;
  accountId?: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'bk';
  profile_picture?: string | null;
  profilePicture?: string | null;
  nik?: string;
  nim?: string;
  nip?: string;
  nidn?: string;
  nuptk?: string;
  faculty?: string;
  major?: string;
  semester?: number;
}

interface UserWithPassword extends User {
  password: string;
}

export const getAllUsersRealtime = (): UserWithPassword[] => [];

export const getUsersByRole = (_role: 'student' | 'admin' | 'bk'): UserWithPassword[] => [];

export const addNewUser = (_user: UserWithPassword): { success: boolean; message: string } => ({
  success: false,
  message: 'Pembuatan user harus melalui API admin backend.'
});

export const updateUserData = (_userId: string, _updatedData: Partial<UserWithPassword>): { success: boolean; message: string } => ({
  success: false,
  message: 'Update user harus melalui API admin backend.'
});

export const deleteUser = (_userId: string): { success: boolean; message: string } => ({
  success: false,
  message: 'Hapus user harus melalui API admin backend.'
});

export const searchUser = (_query: string): UserWithPassword[] => [];

export const getUserByEmail = (_email: string): UserWithPassword | undefined => undefined;

export const getUserById = (_userId: string): UserWithPassword | undefined => undefined;

export const getStudentStats = () => ({
  totalStudents: 0,
  totalTests: 0,
  levelDistribution: {} as Record<string, number>,
  criticalCases: 0
});

export const initializeSystem = () => undefined;

export default {
  getAllUsersRealtime,
  getUsersByRole,
  addNewUser,
  updateUserData,
  deleteUser,
  searchUser,
  getUserByEmail,
  getUserById,
  getStudentStats,
  initializeSystem
};
