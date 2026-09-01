import axiosInstance from '../axiosInstance';

export interface StoreItem {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface StoreQueryParams {
  search?: string;
  sortBy?: 'name' | 'address' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const storeApi = {
  getAll: (params?: StoreQueryParams) =>
    axiosInstance.get<{ success: boolean; data: StoreItem[] }>('/stores', {
      params,
    }),
  getById: (id: string) =>
    axiosInstance.get<{ success: boolean; data: StoreItem }>(`/stores/${id}`),
  create: (data: { name: string; email: string; address: string; ownerId?: string }) =>
    axiosInstance.post<{ success: boolean; message: string; data: StoreItem }>(
      '/stores',
      data
    ),
};
