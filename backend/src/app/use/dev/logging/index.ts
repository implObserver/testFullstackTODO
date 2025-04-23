import { useMorgan } from './morgan/useMorgan.js';

export const useLoggingMiddleware = () => {
  useMorgan();
};
