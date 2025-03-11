import { FastifyInstance } from 'fastify';
import { getMeHandler } from './user.controller';
import { authMiddleware } from '@/shared/middlewares/auth.middleware';

async function userRoutes(server: FastifyInstance) {
  server.get('/me', { preHandler: authMiddleware }, getMeHandler);
}

export default userRoutes;
