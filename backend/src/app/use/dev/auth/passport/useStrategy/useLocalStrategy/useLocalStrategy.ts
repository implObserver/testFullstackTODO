import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { prismaDB } from '../../../../../../../database/prisma/queries/queries.js';

const verifyCallbackPg = async (identifier, password, done) => {
  try {
    let user;
    const isEmail = validator.isEmail(identifier);
    isEmail
      ? (user = await prismaDB.findUserByEmail(identifier))
      : (user = await prismaDB.findUserByUsername(identifier));

    if (!user) {
      console.log('Incorrect email or username');
      return done(null, false, {
        message: 'Incorrect email or username',
        status: 401,
      });
    }

    if (!user.isVerified) {
      console.log('Почтовый ящик не подтвержден');
      return done(null, false, {
        message: 'Почтовый ящик не подтвержден',
        status: 403,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, {
        message: 'Incorrect password',
        status: 401,
      });
    }

    return done(null, user);
  } catch (err) {
    console.log('catch');
    console.log(err);
    return done(err);
  }
};

const strategy = new LocalStrategy(
  { usernameField: 'identifier' },
  verifyCallbackPg
);

export const useLocalStrategy = () => {
  passport.use(strategy);
};
