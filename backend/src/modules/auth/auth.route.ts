import { FastifyInstance } from 'fastify';
import {
  loginHandler,
  createUserHandler,
  logoutHandler,
  refreshTokenHandler,
} from './auth.controller';
import { signupSchema, loginSchema, refreshSchema } from './auth.schema';
import { validateSchema } from '@/shared/utils/validation';
import { authMiddleware } from '@/shared/middlewares/auth.middleware';

async function authRoutes(server: FastifyInstance) {
  server.post(
    '/signup',
    {
      preValidation: async (req, reply) => {
        await validateSchema(signupSchema)(req.body);
      },
    },
    createUserHandler,
  );

  server.post(
    '/login',
    {
      preValidation: async (req, reply) => {
        await validateSchema(loginSchema)(req.body);
      },
    },
    loginHandler,
  );

  server.post(
    '/logout',
    {
      schema: {
        response: {
          200: { type: 'object', properties: { message: { type: 'string' } } },
        },
      },
      preHandler: authMiddleware,
    },
    logoutHandler,
  );

  server.post(
    '/refresh',
    {
      preHandler: authMiddleware,
      preValidation: async (req, reply) => {
        await validateSchema(refreshSchema)(req.body);
      },
    },
    refreshTokenHandler,
  );
}

export default authRoutes;
