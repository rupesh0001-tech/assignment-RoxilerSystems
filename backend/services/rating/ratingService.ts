import { prisma } from '../../configs/db';
import { AppError } from '../../middlewares/errorMiddleware';

export class RatingService {
  async submitRating(userId: string, storeId: string, value: number) {
    if (value < 1 || value > 5) {
      throw new AppError('Rating must be an integer between 1 and 5', 400);
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    // Upsert rating (if user already rated this store, modify rating; else create)
    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        value,
      },
      create: {
        userId,
        storeId,
        value,
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

    // Recompute store averages
    const allRatings = await prisma.rating.findMany({
      where: { storeId },
    });
    const totalRatings = allRatings.length;
    const averageRating = (
      allRatings.reduce((acc, r) => acc + r.value, 0) / totalRatings
    ).toFixed(1);

    return {
      rating,
      averageRating: Number(averageRating),
      totalRatings,
    };
  }

  async getMyRatings(userId: string) {
    const ratings = await prisma.rating.findMany({
      where: { userId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return ratings;
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
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!store) {
      return {
        store: null,
        averageRating: 0,
        totalRatings: 0,
        ratings: [],
      };
    }

    const count = store.ratings.length;
    const sum = store.ratings.reduce((acc, r) => acc + r.value, 0);
    const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;

    return {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      averageRating: avg,
      totalRatings: count,
      ratings: store.ratings.map((r) => ({
        id: r.id,
        value: r.value,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        user: r.user,
      })),
    };
  }
}

export const ratingService = new RatingService();
