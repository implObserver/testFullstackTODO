import { catchNotFoundError } from './errorCatches/useErrorCatches.js';
import { handleDevErrors } from './errorHandlers/useErrorHandlers.js';

export const useErrorsMiddleware = () => {
  catchNotFoundError();
  handleDevErrors();
};
