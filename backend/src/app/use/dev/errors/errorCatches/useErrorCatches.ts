import createError from 'http-errors';
import { app } from '../../../../app.js';

export const catchNotFoundError = () => {
  app.use(function (req, res, next) {
    next(createError(404));
  });
};
