import prisma from '@/shared/services/prisma';
import { UserWithPreferences } from '@/shared/types/user.types';
import { Preferences } from '@prisma/client';

export const getUserById = async (
  userId: number,
): Promise<UserWithPreferences> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        preferences: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error: unknown) {
    const err = error as Error;

    if (err.message === 'User not found') {
      throw err;
    }

    throw new Error('Error fetching user data');
  }
};

export const getUserPreferencesById = async (
  userId: number,
): Promise<Preferences | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        preferences: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const preferences = await prisma.preferences.findUnique({
      where: {
        userId: userId,
      },
    });

    return preferences;
  } catch (error: unknown) {
    throw new Error('Error fetching preferences');
  }
};

export const setUserPreferencesById = async (
  userId: number,
  preferencesPayload: Preferences,
): Promise<Preferences> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        preferences: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let preferences = await prisma.preferences.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!preferences) {
      preferences = await prisma.preferences.create({
        data: {
          ...preferencesPayload,
          userId: userId,
        },
      });
    } else {
      preferences = await prisma.preferences.update({
        where: {
          userId: userId,
        },
        data: {
          ...preferencesPayload,
        },
      });
    }

    return preferences;
  } catch (error: unknown) {
    throw new Error('Error updating preferences');
  }
};
