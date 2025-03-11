import prisma from '@/shared/services/prisma';

export const getUserById = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
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
