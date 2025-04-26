import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { prismaDB } from '../../../../../../../database/queries/queries.js'; // обнови путь под свой
import { User } from '@prisma/client';

interface CustomVerifyCallback {
  (
    login: string,
    password: string,
    done: (error: unknown, user?: Express.User | false, options?: { message: string; status: number }) => void
  ): Promise<void>;
}

// Верификация по логину (username)
const verifyCallbackPg: CustomVerifyCallback = async (login, password, done) => {
  try {
    const user: User | null = await prismaDB.findUserByLogin(login);

    if (!user) {
      return done(null, false, {
        message: 'Неверный логин',
        status: 401,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return done(null, false, {
        message: 'Неверный пароль',
        status: 401,
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

// Стратегия Local (вводим "login" вместо "username")
const strategy = new LocalStrategy(
  { usernameField: 'login' }, // в форме должен быть input с name="login"
  verifyCallbackPg
);

export const useLocalStrategy = (): void => {
  passport.use(strategy);
};
