import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../configs/jwt';
import { prisma } from '../configs/db';
import { AppError } from './errorMiddleware';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    address: string;
  };
}

export type AuthRequest = AuthenticatedRequest;

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Unauthorized: Missing or invalid token', 401));
    }

    const token = authHeader.split(' ')[1];
    let payload: JwtPayload;

    try {
      payload = verifyToken(token);
    } catch (err: any) {
      return next(new AppError('Unauthorized: Token expired or invalid', 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
      },
    });

    if (!user) {
      return next(new AppError('Unauthorized: User no longer exists', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = verifyToken(token);
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            address: true,
          },
        });
        if (user) {
          req.user = user;
        }
      } catch (err) {
        // Ignore optional auth token verification error
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('Forbidden: You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
