import { usePassport } from './passport/index.js';

export const useAuthMiddleware = () => {
  usePassport();
};
