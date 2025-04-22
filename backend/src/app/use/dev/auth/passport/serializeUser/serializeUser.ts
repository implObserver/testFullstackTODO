import passport from 'passport';

export const setSerializeUser = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
};
