import { FastifyRequest, FastifyReply } from 'fastify';
import {
  getUserById,
  getUserPreferencesById,
  setUserPreferencesById,
} from './user.service';
import { Preferences } from '@prisma/client';
import { PreferencesInput } from './user.schema';

export const getMeHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = req.user!.id;
    const user = await getUserById(userId);

    return reply.send(user);
  } catch (error: unknown) {
    const err = error as Error;
    req.log.error(err, 'Error fetching user data');

    if (err.message === 'User not found') {
      return reply.status(404).send({ message: 'User not found' });
    }

    return reply.status(500).send({ message: 'Error fetching user data' });
  }
};

export const getPreferencesHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = req.user!.id;
    const preferences = await getUserPreferencesById(userId);

    if (!preferences) {
      return reply.status(404).send({ message: 'Preferences not found' });
    }

    return reply.send(preferences);
  } catch (error: unknown) {
    req.log.error(error, 'Error fetching user preferences');

    return reply
      .status(500)
      .send({ message: 'Error fetching user preferences' });
  }
};

export const setPreferencesHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = req.user!.id;
    const preferencesPayload = req.body as PreferencesInput;

    const updatedPreferences = await setUserPreferencesById(
      userId,
      preferencesPayload as Preferences,
    );

    return reply.status(200).send(updatedPreferences);
  } catch (error: unknown) {
    req.log.error(error, 'Error updating user preferences');

    return reply
      .status(500)
      .send({ message: 'Error updating user preferences' });
  }
};
