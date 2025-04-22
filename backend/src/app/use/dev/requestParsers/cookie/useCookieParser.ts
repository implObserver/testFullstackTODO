import cookieParser from 'cookie-parser';
import { app } from '../../../../app.js';

export const useCookieParser = () => {
  app.use(cookieParser());
};
