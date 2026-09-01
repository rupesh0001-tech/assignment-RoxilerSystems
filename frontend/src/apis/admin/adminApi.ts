import axiosInstance from '../axiosInstance';

export interface AdminMetrics {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'SYSTEM_ADMIN' | 'STORE_OWNER' | 'NORMAL_USER';
  createdAt: string;
  store: {
    id: string;
    name: string;
    rating: number | null;
  } | null;
}

export interface AdminUserQueryParams {
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const adminApi = {
  getMetrics: () =>
    axiosInstance.get<{ success: boolean; data: AdminMetrics }>('/admin/metrics'),
  getUsers: (params?: AdminUserQueryParams) =>
    axiosInstance.get<{ success: boolean; data: AdminUserItem[] }>('/admin/users', {
      params,
    }),
  createUser: (data: {
    name: string;
    email: string;
    password: string;
    address: string;
    role: 'SYSTEM_ADMIN' | 'STORE_OWNER' | 'NORMAL_USER';
  }) =>
    axiosInstance.post<{ success: boolean; message: string; data: AdminUserItem }>(
      '/admin/users',
      data
    ),
};
