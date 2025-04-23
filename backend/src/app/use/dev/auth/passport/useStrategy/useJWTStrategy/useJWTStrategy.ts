import passport from 'passport';
import { Strategy as JwtStrategy, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import { prismaDB } from '../../../../../../../database/queries/queries.js';
import { __pathToKeyFolder } from './keypair/generateKeypair.js';
import { User } from '@prisma/client'; // если используешь Prisma

const pathToKey = path.join(__pathToKeyFolder, 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// Извлечение токена из cookie
const cookieExtractor = (req: Request): string | null => {
  let token: string | null = null;

  if (req && req.cookies) {
    token = req.cookies['accessToken'];

    if (token && typeof token === 'string' && token.startsWith('Bearer ')) {
      return token.slice(7); // удаляем "Bearer "
    } else if (token) {
      return token;
    }
  }

  return token;
};

// Опции стратегии
const options: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
  passReqToCallback: true,
};

// Callback для верификации
const verifyCallbackPg = async (
  req: Request,
  payload: any, // можешь определить интерфейс для JWT payload
  done: VerifiedCallback
): Promise<void> => {
  try {
    const refreshToken = req.cookies['refreshToken'];
    const user: User | null = await prismaDB.findUser(payload.sub);

    if (!user) {
      return done(null, false);
    }

    if (user.refreshToken !== refreshToken) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err as Error);
  }
};

// Регистрируем стратегию
const strategy = new JwtStrategy(options, verifyCallbackPg);

export const useJWTStrategy = (): void => {
  passport.use(strategy);
};

