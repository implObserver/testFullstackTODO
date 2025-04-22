import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import fs from 'fs';
import { __pathToKeyFolder } from './keypair/generateKeypair.js';
import path from 'path';
import { prismaDB } from '../../../../../../../database/prisma/queries/queries.js';

const pathToKey = path.join(__pathToKeyFolder, 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['accessToken'];

    // Проверка, есть ли токен и не является ли он undefined
    if (token && typeof token === 'string' && token.startsWith('Bearer ')) {
      return token.slice(7); // Удаляем 'Bearer ' из токена
    } else if (token) {
      return token; // Если токен не начинается с 'Bearer ', просто возвращаем его
    }
  }
  return token; // Если токен не найден, возвращаем null
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
  passReqToCallback: true,
};

//for postgresDB
const verifyCallbackPg = async (req, payload, done) => {
  try {
    const refreshToken = req.cookies['refreshToken'];
    const user = await prismaDB.findUser(payload.sub);
    if (!user) {
      return done(null, false);
    }
    console.log(user.refreshToken !== refreshToken);
    if (user.refreshToken !== refreshToken) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const strategy = new JwtStrategy(options, verifyCallbackPg);

export const useJWTStrategy = () => {
  passport.use(strategy);
};
