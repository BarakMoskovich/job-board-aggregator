import { Preferences } from '@prisma/client';
import { BasicUser } from './auth.types';

export type UserWithPreferences = BasicUser & {
  preferences: Preferences | null;
};
