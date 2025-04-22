import passport from 'passport';
import { app } from '../../../../../app.js';

export const usePassportSession = () => {
  app.use(passport.session());
};
