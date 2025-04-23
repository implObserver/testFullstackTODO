import { Router } from 'express';
import { userRouter } from './components/user.js';
import { taskRouter } from './components/task.js';
export const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/task', taskRouter);
