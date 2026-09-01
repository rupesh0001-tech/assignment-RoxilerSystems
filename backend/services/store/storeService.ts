import { prisma } from '../../configs/db';
import { AppError } from '../../middlewares/errorMiddleware';

export interface StoreQueryParams {
  search?: string;
  sortBy?: 'name' | 'address' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  userId?: string;
}

export class StoreService {
  async getAllStores(params: StoreQueryParams) {
    const { search, sortBy = 'name', sortOrder = 'asc', userId } = params;

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const stores = await prisma.store.findMany({
      where: whereClause,
      include: {
        ratings: {
          select: {
            id: true,
            value: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy:
        sortBy === 'rating'
          ? undefined
          : {
              [sortBy]: sortOrder,
            },
    });

    const enrichedStores = stores.map((store) => {
      const count = store.ratings.length;
      const sum = store.ratings.reduce((acc, r) => acc + r.value, 0);
      const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;
      const userRating = userId
        ? store.ratings.find((r) => r.userId === userId)?.value || null
        : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avg,
        totalRatings: count,
        userRating,
        owner: store.owner,
        createdAt: store.createdAt,
      };
    });

    if (sortBy === 'rating') {
      enrichedStores.sort((a, b) =>
        sortOrder === 'asc'
          ? a.averageRating - b.averageRating
          : b.averageRating - a.averageRating
      );
    }

    return enrichedStores;
  }

  async getStoreById(storeId: string, userId?: string) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
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
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    const count = store.ratings.length;
    const sum = store.ratings.reduce((acc, r) => acc + r.value, 0);
    const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;
    const userRating = userId
      ? store.ratings.find((r) => r.userId === userId)?.value || null
      : null;

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating: avg,
      totalRatings: count,
      userRating,
      owner: store.owner,
      ratings: store.ratings,
      createdAt: store.createdAt,
    };
  }

  async createStore(data: {
    name: string;
    email: string;
    address: string;
    ownerId: string;
  }) {
    const existing = await prisma.store.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('A store with this email already exists', 400);
    }

    const owner = await prisma.user.findUnique({
      where: { id: data.ownerId },
    });

    if (!owner || owner.role !== 'STORE_OWNER') {
      throw new AppError('Specified owner must be a registered Store Owner', 400);
    }

    const newStore = await prisma.store.create({
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        ownerId: data.ownerId,
      },
    });

    return newStore;
  }
}

export const storeService = new StoreService();
