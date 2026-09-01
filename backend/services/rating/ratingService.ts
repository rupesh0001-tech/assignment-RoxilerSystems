import { prisma } from '../../configs/db';
import { AppError } from '../../middlewares/errorMiddleware';

export class RatingService {
  async submitRating(userId: string, storeId: string, value: number, comment?: string) {
    if (value < 1 || value > 5) {
      throw new AppError('Rating must be an integer between 1 and 5', 400);
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        value,
        comment: comment !== undefined ? comment : undefined,
      },
      create: {
        userId,
        storeId,
        value,
        comment: comment || null,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return rating;
  }

  async getStoreReviews(storeId: string) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    const totalRatings = store.ratings.length;
    const averageRating =
      totalRatings > 0
        ? Number(
            (
              store.ratings.reduce((acc, r) => acc + r.value, 0) / totalRatings
            ).toFixed(1)
          )
        : 0;

    return {
      storeId: store.id,
      storeName: store.name,
      averageRating,
      totalRatings,
      reviews: store.ratings.map((r) => ({
        id: r.id,
        value: r.value,
        comment: r.comment,
        createdAt: r.createdAt,
        user: {
          id: r.user.id,
          name: r.user.name,
          address: r.user.address,
        },
      })),
    };
  }

  async getStoreOwnerReviews(ownerId: string) {
    const store = await prisma.store.findFirst({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!store) {
      return {
        storeName: null,
        averageRating: 0,
        totalRatings: 0,
        ratings: [],
      };
    }

    const totalRatings = store.ratings.length;
    const averageRating =
      totalRatings > 0
        ? Number(
            (
              store.ratings.reduce((acc, r) => acc + r.value, 0) / totalRatings
            ).toFixed(1)
          )
        : 0;

    return {
      storeName: store.name,
      averageRating,
      totalRatings,
      ratings: store.ratings.map((r) => ({
        id: r.id,
        value: r.value,
        comment: r.comment,
        createdAt: r.createdAt,
        user: {
          id: r.user.id,
          name: r.user.name,
          email: r.user.email,
          address: r.user.address,
        },
      })),
    };
  }
}

export const ratingService = new RatingService();
