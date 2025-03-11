import { FastifyRequest, FastifyReply } from 'fastify';
import {
  loginUser,
  createNewUser,
  revokeRefreshToken,
  generateNewAccessToken,
} from './auth.service';
import { LoginInput, RefreshInput, SignupInput } from './auth.schema';
import { env } from '@/config/env';

export const createUserHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const user = await createNewUser(req.body as SignupInput);
    const { password, ...userWithoutPassword } = user;

    return reply.status(201).send(userWithoutPassword);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error as any).code === 'P2002' &&
      (error as any).meta?.target?.includes('email')
    ) {
      return reply.status(409).send({ message: 'Email already exists' });
    }

    req.log.error(error, 'Error creating user');
    return reply.status(500).send({ message: 'Error creating user' });
  }
};

export const loginHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { accessToken, refreshToken } = await loginUser(
      req.body as LoginInput,
    );

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      path: '/',
    });

    return reply.send({ accessToken });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return reply.status(401).send({ message: 'Invalid email or password' });
    }
    req.log.error(error, 'Error during login');

    return reply.status(500).send({ message: 'Internal server error' });
  }
};

export const logoutHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return reply.status(400).send({ message: 'No refresh token provided' });
    }

    await revokeRefreshToken(refreshToken);

    reply.clearCookie('refreshToken', {
      path: '/',
      httpOnly: true,
      secure: true,
    });

    return reply.send({ message: 'Logged out successfully' });
  } catch (error: unknown) {
    req.log.error(error, 'Error during logout');
    return reply.status(500).send({ message: 'Error processing logout' });
  }
};

export const refreshTokenHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { refreshToken } = req.body as RefreshInput;

    const newAccessToken = await generateNewAccessToken(refreshToken);

    return reply.send({ accessToken: newAccessToken });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.message === 'Invalid refresh token' ||
        error.name === 'JsonWebTokenError')
    ) {
      return reply
        .status(401)
        .send({ message: 'Invalid or expired refresh token' });
    }
    req.log.error(error, 'Error refreshing token');
    return reply.status(500).send({ message: 'Error refreshing access token' });
  }
};
