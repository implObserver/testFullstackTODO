import { Router } from "express";
import { checkAuthController, loginController, logoutController, registerController, validateRegister } from "../../../controllers/user/userController.js";

export const authRouter = Router();

authRouter.post('/register', validateRegister, registerController);
authRouter.post('/login', loginController);
authRouter.post('/logout', logoutController);
authRouter.get('/check-auth', checkAuthController);