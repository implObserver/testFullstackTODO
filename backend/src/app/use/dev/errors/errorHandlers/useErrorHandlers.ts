// middlewares/error/handleDevErrors.ts
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

export const handleDevErrors = () => {
  return function (
    err: AppError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) {
    const isDev = req.app.get('env') === 'development';

    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: isDev ? err : {},
    });
  };
};
