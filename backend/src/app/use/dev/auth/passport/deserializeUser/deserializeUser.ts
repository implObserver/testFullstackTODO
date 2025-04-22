import passport from 'passport';
import { prismaDB } from '../../../../../../database/prisma/queries/queries.js';

export const setDeserializeUser = () => {
  passport.deserializeUser(async (id, done) => {
    try {
      //const user = await User.findById(id); //for mongoDB
      const user = await prismaDB.findUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
