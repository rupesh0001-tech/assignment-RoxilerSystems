import axiosInstance from '../axiosInstance';

export interface RegisterPayload {
  name: string;
  email: string;
  address: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'SYSTEM_ADMIN' | 'STORE_OWNER' | 'NORMAL_USER';
  createdAt: string;
  storeInfo?: {
    stores?: Array<{
      id: string;
      name: string;
      address: string;
      ratingsCount: number;
    }>;
    storesCount?: number;
    totalRatings: number;
    averageRating: string;
  } | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
    token: string;
  };
}

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const res = await axiosInstance.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  login: async (payload: LoginPayload) => {
    const res = await axiosInstance.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  logout: async () => {
    const res = await axiosInstance.post<{ success: boolean; message: string }>('/auth/logout');
    return res.data;
  },

  getProfile: async () => {
    const res = await axiosInstance.get<{ success: boolean; data: UserProfile }>('/auth/profile');
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await axiosInstance.post<{
      success: boolean;
      data: { message: string; resetToken?: string; resetUrl?: string };
    }>('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const res = await axiosInstance.post<{ success: boolean; message: string }>('/auth/reset-password', payload);
    return res.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const res = await axiosInstance.post<{ success: boolean; message: string }>('/auth/change-password', payload);
    return res.data;
  },
};
