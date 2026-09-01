import axiosInstance from '../axiosInstance';

export interface RatingReviewItem {
  id: string;
  value: number;
  comment?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email?: string;
    address: string;
  };
}

export interface StoreOwnerReviewData {
  storeName: string | null;
  averageRating: number;
  totalRatings: number;
  ratings: RatingReviewItem[];
}

export interface StorePublicReviewsData {
  storeId: string;
  storeName: string;
  averageRating: number;
  totalRatings: number;
  reviews: RatingReviewItem[];
}

export const ratingApi = {
  submitRating: (storeId: string, value: number, comment?: string) =>
    axiosInstance.post<{ success: boolean; message: string; data: any }>('/ratings', {
      storeId,
      value,
      comment,
    }),
  getStoreReviews: (storeId: string) =>
    axiosInstance.get<{ success: boolean; data: StorePublicReviewsData }>(
      `/ratings/store/${storeId}`
    ),
  getStoreOwnerReviews: () =>
    axiosInstance.get<{ success: boolean; data: StoreOwnerReviewData }>(
      '/ratings/store-owner'
    ),
};
