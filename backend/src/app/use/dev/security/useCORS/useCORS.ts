import cors from 'cors';
import { app } from '../../../../app.js';

export const useCORS = () => {
  const front = process.env.FRONT_URL;

  if (!front) {
    console.warn('[CORS] ⚠️ FRONT_URL не задан в .env');
  } else {
    console.log('[CORS] FRONT_URL:', front);
  }

  app.use(cors({
    origin: front || '*',
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  }));
};

