import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../../configs/db';
import { signToken } from '../../configs/jwt';
import { AppError } from '../../middlewares/errorMiddleware';

export class AuthService {
  /**
   * Register a new normal user with required profile fields
   */
  async register(data: {
    name: string;
    email: string;
    address: string;
    password: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('An account with this email already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        passwordHash,
        role: 'NORMAL_USER',
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

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  /**
   * Single login system for all users (Admin, Store Owner, Normal User)
   */
  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Check if store owner has store info or rating
    let storeInfo = null;
    if (user.role === 'STORE_OWNER') {
      const stores = await prisma.store.findMany({
        where: { ownerId: user.id },
        include: {
          ratings: true,
        },
      });

      if (stores.length > 0) {
        const totalRatings = stores.reduce(
          (acc, s) => acc + s.ratings.length,
          0
        );
        const sumRatings = stores.reduce(
          (acc, s) => acc + s.ratings.reduce((rSum, r) => rSum + r.value, 0),
          0
        );
        const avgRating =
          totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 'N/A';

        storeInfo = {
          storesCount: stores.length,
          totalRatings,
          averageRating: avgRating,
        };
      }
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        storeInfo,
      },
      token,
    };
  }

  /**
   * Fetch current user profile with role-specific data
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    let storeInfo = null;
    if (user.role === 'STORE_OWNER') {
      const stores = await prisma.store.findMany({
        where: { ownerId: user.id },
        include: {
          ratings: true,
        },
      });

      const totalRatings = stores.reduce(
        (acc, s) => acc + s.ratings.length,
        0
      );
      const sumRatings = stores.reduce(
        (acc, s) => acc + s.ratings.reduce((rSum, r) => rSum + r.value, 0),
        0
      );
      const avgRating =
        totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 'N/A';

      storeInfo = {
        stores: stores.map((s) => ({
          id: s.id,
          name: s.name,
          address: s.address,
          ratingsCount: s.ratings.length,
        })),
        totalRatings,
        averageRating: avgRating,
      };
    }

    return { ...user, storeInfo };
  }

  /**
   * Request password reset token
   */
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return generic message for security
      return {
        message: 'If the email exists, a password reset token has been issued.',
        resetToken: null,
      };
    }

    // Invalidate old tokens
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate random secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      message: 'Password reset token generated successfully.',
      resetToken: token,
      resetUrl: `/reset-password?token=${token}`,
    };
  }

  /**
   * Reset password using token
   */
  async resetPassword(data: { token: string; newPassword: string }) {
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: data.token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      throw new AppError('Invalid or expired password reset token', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.newPassword, salt);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
    ]);

    return { message: 'Password has been reset successfully. Please log in with your new password.' };
  }

  /**
   * Change password for logged-in user
   */
  async changePassword(data: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await bcrypt.compare(
      data.currentPassword,
      user.passwordHash
    );
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { message: 'Password updated successfully' };
  }
}

export const authService = new AuthService();
