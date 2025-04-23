import logger from 'morgan';
import { app } from '../../../../app.js';

export const useMorgan = () => {
  app.use(logger('dev'));
};
