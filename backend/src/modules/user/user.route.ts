import { FastifyInstance } from 'fastify';
import {
  getMeHandler,
  getPreferencesHandler,
  setPreferencesHandler,
} from './user.controller';
import { authMiddleware } from '@/shared/middlewares/auth.middleware';
import { validateSchema } from '@/shared/utils/validation';
import { preferencesSchema } from './user.schema';

async function userRoutes(server: FastifyInstance) {
  server.get('/me', { preHandler: authMiddleware }, getMeHandler);

  server.get(
    '/preferences',
    { preHandler: authMiddleware },
    getPreferencesHandler,
  );

  server.post(
    '/preferences',
    {
      preValidation: async (req, reply) => {
        await validateSchema(preferencesSchema)(req.body);
      },
      preHandler: authMiddleware,
    },
    setPreferencesHandler,
  );
}

export default userRoutes;
