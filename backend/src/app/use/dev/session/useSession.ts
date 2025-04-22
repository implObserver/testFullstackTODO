import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { app } from '../../../app.js';
import 'dotenv/config';
import RedisModule from 'ioredis';

const Redis = RedisModule.default;

// Создаем экземпляр клиента Redis
export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not defined in environment variables');
}

export const useSession = () => {
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
  );
};
