import passport from 'passport';
import { prismaDB } from '../../../../../../database/queries/queries.js';
import { DoneFunction } from '../../../../../../types/serviceTypes/userSerialize.types.js';

export const setDeserializeUser = () => {
  passport.deserializeUser(async (id: number, done: DoneFunction) => {
    try {
      //const user = await User.findById(id); //for mongoDB
      const user = await prismaDB.findUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
