import { Router } from 'express';
import { userRouter } from './components/user.js';
export const apiRouter = Router();

apiRouter.use('/user', userRouter);
