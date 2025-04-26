import { Router } from 'express';
import { taskRouter } from './components/task.js';
import { authRouter } from './components/auth.js';
import { swaggerRouter } from './components/swagger.js';
import { userRouter } from './components/user.js';
export const apiRouter = Router();

apiRouter.use(swaggerRouter);
apiRouter.use('/api/auth', authRouter);
apiRouter.use('/api/tasks', taskRouter);
apiRouter.use('/api/user', userRouter);