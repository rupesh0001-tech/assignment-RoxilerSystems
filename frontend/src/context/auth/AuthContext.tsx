import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../../apis/auth/authApi';
import type { UserProfile, RegisterPayload, LoginPayload } from '../../apis/auth/authApi';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<UserProfile>;
  register: (payload: RegisterPayload) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ratehub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('ratehub_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async (): Promise<UserProfile | null> => {
    const currentToken = localStorage.getItem('ratehub_token');
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const res = await authApi.getProfile();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('ratehub_user', JSON.stringify(res.data));
        return res.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      localStorage.removeItem('ratehub_token');
      localStorage.removeItem('ratehub_user');
      setUser(null);
      setToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(payload);
      const { user: loggedInUser, token: authToken } = res.data;
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('ratehub_token', authToken);
      localStorage.setItem('ratehub_user', JSON.stringify(loggedInUser));
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(payload);
      const { user: registeredUser, token: authToken } = res.data;
      setUser(registeredUser);
      setToken(authToken);
      localStorage.setItem('ratehub_token', authToken);
      localStorage.setItem('ratehub_user', JSON.stringify(registeredUser));
      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('ratehub_token');
      localStorage.removeItem('ratehub_user');
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
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
