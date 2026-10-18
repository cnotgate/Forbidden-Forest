import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, onboardingApi, migrationApi, setAccessToken, getAccessToken } from '../services/api';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  isOnboarded: boolean;
  avatarUrl?: string | null;
  googleId?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasLocalData: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, pass: string, name: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (fullName: string) => Promise<{ success: boolean; message?: string }>;
  deleteAccount: () => Promise<{ success: boolean; message?: string }>;
  completeOnboarding: (data: any) => Promise<{ success: boolean; message?: string; state?: any }>;
  migrateLocalData: (localState: any) => Promise<{ success: boolean; message?: string; state?: any }>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLocalData, setHasLocalData] = useState<boolean>(false);

  const checkLocalData = () => {
    try {
      const stored = localStorage.getItem('doctor_tracker_ukmppd_state_v1');
      setHasLocalData(!!stored);
    } catch {
      setHasLocalData(false);
    }
  };

  const checkAuth = async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLocalData();
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const res = await authApi.login({ email, password: pass });
    setIsLoading(false);

    if (res.success && res.data) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login gagal' };
  };

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    const res = await authApi.googleLogin(credential);
    setIsLoading(false);

    if (res.success && res.data) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login dengan Google gagal' };
  };

  const register = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    // Purge any residual browser local state so new account never reads old data
    try {
      localStorage.removeItem('doctor_tracker_ukmppd_state_v2');
      localStorage.removeItem('doctor_tracker_ukmppd_state_v1');
    } catch {}

    const res = await authApi.register({ email, password: pass, fullName: name });
    setIsLoading(false);

    if (res.success && res.data) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.message || 'Pendaftaran gagal' };
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    // Purge tokens and local generic cache
    setAccessToken(null);
    setUser(null);
    try {
      localStorage.removeItem('doctor_tracker_ukmppd_state_v2');
      localStorage.removeItem('doctor_tracker_ukmppd_state_v1');
    } catch {}
  };

  const updateProfile = async (fullName: string) => {
    const res = await authApi.updateProfile({ fullName });
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Gagal memperbarui profil' };
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    const res = await authApi.deleteAccount();
    setIsLoading(false);
    if (res.success) {
      const currentUserId = user?.id;
      // Clear token and memory user
      setAccessToken(null);
      setUser(null);
      // Clear local storage doctor tracker state so user starts clean
      try {
        if (currentUserId) {
          localStorage.removeItem(`doctor_tracker_user_${currentUserId}`);
        }
        localStorage.removeItem('doctor_tracker_ukmppd_state_v2');
        localStorage.removeItem('doctor_tracker_ukmppd_state_v1');
      } catch {}
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Gagal menghapus akun' };
  };

  const completeOnboarding = async (data: any) => {
    const res = await onboardingApi.complete(data);
    if (res.success && res.data) {
      if (user) {
        setUser({ ...user, isOnboarded: true });
      }
      return { success: true, state: res.data.state };
    }
    return { success: false, message: res.message };
  };

  const migrateLocalData = async (localState: any) => {
    const res = await migrationApi.importLocalStorage(localState);
    if (res.success && res.data) {
      if (user) {
        setUser({ ...user, isOnboarded: true });
      }
      return { success: true, message: res.message, state: res.data.state };
    }
    return { success: false, message: res.message };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        hasLocalData,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        deleteAccount,
        completeOnboarding,
        migrateLocalData,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

