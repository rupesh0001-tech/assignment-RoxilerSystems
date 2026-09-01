import bcrypt from 'bcryptjs';
import { prisma } from '../../configs/db';
import { AppError } from '../../middlewares/errorMiddleware';
import { Role } from '@prisma/client';

export interface AdminUserQueryParams {
  search?: string;
  role?: Role;
  sortBy?: 'name' | 'email' | 'address' | 'role' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export class AdminService {
  async getPlatformMetrics() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }

  async getAllUsers(params: AdminUserQueryParams) {
    const { search, role, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const whereClause: any = {};
    if (role) {
      whereClause.role = role;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: {
          include: {
            ratings: {
              select: { value: true },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return users.map((u) => {
      let storeInfo: { id: string; name: string; rating: number | null } | null = null;
      if (u.stores && u.stores.length > 0) {
        const primaryStore = u.stores[0];
        const count = primaryStore.ratings.length;
        const sum = primaryStore.ratings.reduce((acc, r) => acc + r.value, 0);
        const storeRating = count > 0 ? Number((sum / count).toFixed(1)) : 0;
        storeInfo = {
          id: primaryStore.id,
          name: primaryStore.name,
          rating: storeRating,
        };
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role,
        createdAt: u.createdAt,
        store: storeInfo,
      };
    });
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    address: string;
    role: Role;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('A user with this email already exists', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        address: data.address,
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  async updateUser(
    userId: string,
    data: {
      name?: string;
      email?: string;
      address?: string;
      role?: Role;
      password?: string;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (emailExists) {
        throw new AppError('Email is already taken by another user', 400);
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.address) updateData.address = data.address;
    if (data.role) updateData.role = data.role;
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }

  async updateStore(
    storeId: string,
    data: {
      name?: string;
      email?: string;
      address?: string;
      ownerId?: string;
    }
  ) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    if (data.email && data.email !== store.email) {
      const emailExists = await prisma.store.findUnique({
        where: { email: data.email },
      });
      if (emailExists) {
        throw new AppError('A store with this email already exists', 400);
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.address) updateData.address = data.address;
    if (data.ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: data.ownerId },
      });
      if (!owner || owner.role !== 'STORE_OWNER') {
        throw new AppError('Specified owner must be a registered Store Owner', 400);
      }
      updateData.ownerId = data.ownerId;
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: updateData,
    });

    return updatedStore;
  }

  async deleteStore(storeId: string) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    await prisma.store.delete({
      where: { id: storeId },
    });

    return { message: 'Store deleted successfully' };
  }
}

export const adminService = new AdminService();
