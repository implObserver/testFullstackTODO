import { User } from '@prisma/client';
import { PublicUser, FullUser } from './user.types.js';

export const mapToPublicUser = (user: User): PublicUser => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  middleName: user.middleName ?? undefined,
  login: user.login,
});

export const mapToFullUser = (user: User): FullUser => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  middleName: user.middleName ?? undefined,
  login: user.login,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  managerId: user.managerId ?? undefined,
});