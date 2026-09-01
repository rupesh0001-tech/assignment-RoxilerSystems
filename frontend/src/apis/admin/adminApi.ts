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
  getUserById: (id: string) =>
    axiosInstance.get<{ success: boolean; data: AdminUserItem }>(`/admin/users/${id}`),
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
  updateUser: (
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      address?: string;
      role?: 'SYSTEM_ADMIN' | 'STORE_OWNER' | 'NORMAL_USER';
    }
  ) =>
    axiosInstance.put<{ success: boolean; message: string; data: AdminUserItem }>(
      `/admin/users/${id}`,
      data
    ),
  deleteUser: (id: string) =>
    axiosInstance.delete<{ success: boolean; message: string }>(`/admin/users/${id}`),

  updateStore: (
    id: string,
    data: {
      name?: string;
      email?: string;
      address?: string;
      ownerId?: string;
    }
  ) =>
    axiosInstance.put<{ success: boolean; message: string; data: any }>(
      `/admin/stores/${id}`,
      data
    ),
  deleteStore: (id: string) =>
    axiosInstance.delete<{ success: boolean; message: string }>(`/admin/stores/${id}`),
};
