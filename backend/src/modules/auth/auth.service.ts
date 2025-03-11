import prisma from '@/shared/services/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { REFRESH_TOKEN_EXPIRATION_MS } from '@/config/constants';
import { IAuth, INewUser, IUserCredentials } from '@/shared/types/auth.types';
import { env } from '@/config/env';

export const createNewUser = async ({
  email,
  password,
  name,
}: INewUser): Promise<User> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  } catch (error: unknown) {
    throw error;
  }
};

export const loginUser = async ({
  email,
  password,
}: IUserCredentials): Promise<IAuth> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const accessToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId: user.id }, env.REFRESH_SECRET, {
    expiresIn: '7d',
  });

  try {
    await prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS),
      },
    });

    return { accessToken, refreshToken };
  } catch (error: unknown) {
    throw new Error('Error generating authentication tokens');
  }
};

export const revokeRefreshToken = async (token: string) => {
  try {
    await prisma.refreshToken.deleteMany({ where: { token } });
  } catch (error: unknown) {
    throw new Error('Error revoking refresh token');
  }
};

export const generateNewAccessToken = async (refreshToken: string) => {
  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    const payload = jwt.verify(refreshToken, env.REFRESH_SECRET) as {
      userId: string;
    };

    return jwt.sign({ userId: payload.userId }, env.JWT_SECRET, {
      expiresIn: '15m',
    });
  } catch (error: unknown) {
    throw new Error('Failed to generate new access token');
  }
};
