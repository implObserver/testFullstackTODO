import { Request, Response } from 'express';

interface AppError extends Error {
  status?: number;
  originalStatus?: number; // для специфичных статусов
}

export const handleDevErrors = () => {
  return function (
    err: AppError,
    req: Request,
    res: Response,
  ) {
    const isDev = req.app.get('env') === 'development';

    const statusCode = err.status || err.originalStatus || 500; // используем originalStatus если нужно

    // В режиме разработки выводим полную информацию об ошибке
    if (isDev) {
      return res.status(statusCode).json({
        message: err.message,
        stack: err.stack,
      });
    }

    // В продакшн-режиме, не показываем стек
    return res.status(statusCode).json({
      message: err.message,
      // Можно добавить дополнительные поля, такие как data, если нужно
    });
  };
};

