import { User } from '@prisma/client';

export type BasicUser = Omit<User, 'password'>;

export interface IUserCredentials {
  email: string;
  password: string;
}

export interface INewUser extends IUserCredentials {
  name: string;
}

export interface IRefreshToken {
  refreshToken: string;
}

export interface IAuth extends IRefreshToken {
  accessToken: string;
}
