import axiosInstance from '../axiosInstance';

export interface RatingResult {
  rating: {
    id: string;
    value: number;
    userId: string;
    storeId: string;
    createdAt: string;
    updatedAt: string;
    store: {
      id: string;
      name: string;
    };
  };
  averageRating: number;
  totalRatings: number;
}

export interface StoreOwnerReview {
  id: string;
  value: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
}

export interface StoreOwnerReviewData {
  store: {
    id: string;
    name: string;
    email: string;
    address: string;
  } | null;
  averageRating: number;
  totalRatings: number;
  ratings: StoreOwnerReview[];
}

export const ratingApi = {
  submitRating: (storeId: string, value: number) =>
    axiosInstance.post<{ success: boolean; message: string; data: RatingResult }>(
      '/ratings',
      { storeId, value }
    ),
  getMyRatings: () =>
    axiosInstance.get<{ success: boolean; data: any[] }>('/ratings/my'),
  getStoreOwnerReviews: () =>
    axiosInstance.get<{ success: boolean; data: StoreOwnerReviewData }>(
      '/ratings/store-owner'
    ),
};
