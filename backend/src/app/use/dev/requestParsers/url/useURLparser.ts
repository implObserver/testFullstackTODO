import { urlencoded } from 'express';
import { app } from '../../../../app.js';

export const useURLParser = () => {
  app.use(urlencoded({ extended: true }));
};
