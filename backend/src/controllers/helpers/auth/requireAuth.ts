import passport from 'passport';
import { Request, RequestHandler } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
    user: User;
}

export const requireAuth: RequestHandler = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err: unknown, user: User) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        (req as AuthenticatedRequest).user = user;
        next();
    })(req, res, next);
};
