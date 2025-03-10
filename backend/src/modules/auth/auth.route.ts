import { FastifyInstance } from 'fastify';
import * as Yup from 'yup';
import {
  loginHandler,
  createUserHandler,
  logoutHandler,
  refreshTokenHandler,
} from './auth.controller';
import { signupSchema, loginSchema, refreshSchema } from './auth.schema';

const validateSchema = (schema: Yup.ObjectSchema<any>) => async (data: any) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return data;
  } catch (err: any) {
    throw new Error(err.errors.join(', '));
  }
};

async function authRoutes(server: FastifyInstance) {
  server.post(
    '/signup',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            name: { type: 'string' },
          },
          required: ['email', 'password', 'name'],
        },
      },
      preValidation: async (req, reply) => {
        await validateSchema(signupSchema)(req.body);
      },
    },
    createUserHandler,
  );

  server.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
      },
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
    },
    logoutHandler,
  );

  server.post(
    '/refresh',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            refreshToken: { type: 'string' },
          },
          required: ['refreshToken'],
        },
      },
      preValidation: async (req, reply) => {
        await validateSchema(refreshSchema)(req.body);
      },
    },
    refreshTokenHandler,
  );
}

export default authRoutes;
