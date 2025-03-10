import { FastifyRequest, FastifyReply } from 'fastify';
import {
  loginUser,
  createNewUser,
  revokeRefreshToken,
  generateNewAccessToken,
} from './auth.service';
import { LoginInput, RefreshInput, SignupInput } from './auth.schema';

export const createUserHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = await createNewUser(req.body as SignupInput);

  return reply.status(201).send(user);
};

export const loginHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { accessToken, refreshToken } = await loginUser(req.body as LoginInput);

  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
  });

  return reply.send({ accessToken });
};

export const logoutHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
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
};

export const refreshTokenHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { refreshToken } = req.body as RefreshInput;

  const newAccessToken = await generateNewAccessToken(refreshToken);

  return reply.send({ accessToken: newAccessToken });
};
