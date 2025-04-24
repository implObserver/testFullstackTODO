import { Router } from 'express';
import { taskRouter } from './components/task.js';
import { authRouter } from './components/auth.js';
import { swaggerRouter } from './components/swagger.js';
export const apiRouter = Router();

apiRouter.use(swaggerRouter);
apiRouter.use('/api/auth', authRouter);
apiRouter.use('/task', taskRouter);
