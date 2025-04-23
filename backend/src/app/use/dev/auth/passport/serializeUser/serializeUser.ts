import passport from 'passport';
import { DoneFunction } from '../../../../../../types/serviceTypes/userSerialize.types.js';

export const setSerializeUser = () => {
  passport.serializeUser((user: unknown, done: DoneFunction) => {
    if (typeof user === 'object' && user && 'id' in user) {
      const id = (user as any).id;
      done(null, id);
    } else {
      done(new Error('Invalid user object'));
    }
  });
}
