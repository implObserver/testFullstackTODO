import { Router } from "express";
import {
    checkAuthController,
    loginController,
    logoutController,
    registerController,
    validateRegister
} from "../../../controllers/user/userController.js";
import { requireAuth } from "../../../controllers/helpers/auth/requireAuth.js";


export const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Авторизация и регистрация
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - firstName
 *               - lastName
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Успешная регистрация
 */
authRouter.post('/register', validateRegister, registerController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный вход
 */
authRouter.post('/login', loginController);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход пользователя
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Успешный выход
 */
authRouter.post('/logout', logoutController);

authRouter.use(requireAuth);
/**
 * @swagger
 * /api/auth/check-auth:
 *   get:
 *     summary: Проверка авторизации
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Пользователь авторизован
 */
authRouter.get('/check-auth', checkAuthController);
