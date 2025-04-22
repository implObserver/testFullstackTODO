import { useCORS } from './useCORS/useCORS.js';

export const useSecurityMiddlewares = () => {
  useCORS();
};
