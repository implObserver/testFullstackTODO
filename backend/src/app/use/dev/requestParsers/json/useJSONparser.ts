import { json } from 'express';
import { app } from '../../../../app.js';

export const useJSONParser = () => {
  app.use(json({ limit: '10mb' }));
};
