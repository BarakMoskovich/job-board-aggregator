import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: number };
  }
}

export const authMiddleware = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = { id: (decoded as { userId: number }).userId };
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
};
