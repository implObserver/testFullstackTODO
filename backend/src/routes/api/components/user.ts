import { Router } from 'express';
import { requireAuth } from '../../../controllers/helpers/auth/requireAuth.js';
import { getSubordinatesController } from '../../../controllers/user/userController.js';

export const userRouter = Router();

// Применяем requireAuth ко всем маршрутам ниже
userRouter.use(requireAuth);

userRouter.get('/subordinates', getSubordinatesController);