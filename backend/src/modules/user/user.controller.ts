import { FastifyRequest, FastifyReply } from 'fastify';
import { getUserById } from './user.service';

export const getMeHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

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
