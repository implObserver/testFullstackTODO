import passport from 'passport';
import { Strategy as JwtStrategy, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import { prismaDB } from '../../../../../../../database/queries/queries.js';
import { __pathToKeyFolder } from './keypair/generateKeypair.js';
import { FullUser } from '../../../../../../../types/user/user.types.js';
import { mapToFullUser } from '../../../../../../../types/user/user.mapper.js';

const pathToKey = path.join(__pathToKeyFolder, 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

interface JWTPayload {
  sub: number; // user id
  iat: number;
  exp: number;
}

// Извлечение токена из cookie
const cookieExtractor = (req: Request): string | null => {
  const token = req.cookies?.accessToken;
  if (!token) return null;

  return token.startsWith('Bearer ') ? token.slice(7) : token;
};

const options: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
  passReqToCallback: true,
};

const verifyCallbackPg = async (
  req: Request,
  payload: JWTPayload,
  done: VerifiedCallback
): Promise<void> => {
  try {
    const refreshToken = req.cookies['refreshToken'];
    const user = await prismaDB.findUser(payload.sub);

    if (!user || user.refreshToken !== refreshToken) {
      return done(null, false);
    }

    const fullUser: FullUser = mapToFullUser(user);
    return done(null, fullUser);
  } catch (err) {
    return done(err as Error);
  }
};

const strategy = new JwtStrategy(options, verifyCallbackPg);

export const useJWTStrategy = (): void => {
  passport.use(strategy);
};
