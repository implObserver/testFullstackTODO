import { Request } from 'express';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import { issueJWTPG } from '../../app/use/dev/auth/token/JWT/issueJWT.js';
import { prismaDB } from '../../database/queries/queries.js';
import { mapToPublicUser } from '../../types/user/user.mapper.js';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NewUserInput, PublicUser } from '../../types/user/user.types.js';
import { parseTimeToMs } from '../helpers/parseTimeToMs.js';
import { RequestHandler } from 'express';
import { sendResponse } from '../helpers/responders/responders.js';
interface AuthenticatedRequest extends Request {
    user: User;
}

export const validateRegister = [
    body('login')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Login must be at least 3 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Login must contain only letters, numbers, and underscores')
        .escape(),

    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .escape(),

    body('firstName').optional().trim().escape(),
    body('lastName').optional().trim().escape(),
    body('middleName').optional().trim().escape(),
];

// ...

export const registerController: RequestHandler<
    Record<string, unknown>,
    unknown,
    NewUserInput
> = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
    }

    try {
        const { login, password, firstName, lastName, middleName } = req.body;

        const existingUser = await prismaDB.findUserByLogin(login);
        if (existingUser) {
            res.status(403).json({ error: 'Логин уже занят' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await prismaDB.setNewUser({
            login,
            password: hashedPassword,
            firstName,
            lastName,
            middleName,
        });

        if (!userId) {
            res.status(500).json({ error: 'Ошибка при создании пользователя' });
            return;
        }

        const { accessToken, refreshToken } = issueJWTPG(userId);
        await prismaDB.setToken(userId, refreshToken.token);

        const user = await prismaDB.findUser(userId);
        if (!user) {
            res.status(500).json({ error: 'Пользователь не найден после создания' });
            return;
        }

        res
            .cookie('accessToken', accessToken.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: parseTimeToMs(accessToken.expires),
            })
            .cookie('refreshToken', refreshToken.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: parseTimeToMs(refreshToken.expires),
            });

        sendResponse(res, { user: mapToPublicUser(user) }, undefined, 201);
        return
    } catch (err) {
        next(err);
    }
};

export const loginController: RequestHandler = (req, res, next) => {
    passport.authenticate(
        'local',
        { session: false },
        async (
            err: unknown,
            user: Express.User | false,
            info: { message: string; status?: number } | undefined
        ) => {
            if (err) return next(err);

            if (!user) {
                return res
                    .status(info?.status || 401)
                    .json({ error: info?.message || 'Unauthorized' });
            }

            const typedUser = user as {
                id: number;
                firstName: string;
                // Добавьте другие необходимые поля пользователя
            };

            const { accessToken, refreshToken } = issueJWTPG(typedUser.id);

            try {
                await prismaDB.setToken(typedUser.id, refreshToken.token);

                res
                    .cookie('accessToken', accessToken.token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: parseTimeToMs(accessToken.expires),
                    })
                    .cookie('refreshToken', refreshToken.token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: parseTimeToMs(refreshToken.expires),
                    });

                sendResponse(res, {
                    user: {
                        firstName: typedUser.firstName
                        // Можно добавить другие данные пользователя
                    }
                });
            } catch (dbError) {
                next(dbError);
            }
        }
    )(req, res, next);
};

export const logoutController: RequestHandler = async (req, res, next) => {
    try {
        console.log(req)
        const user = req.user as PublicUser;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        } else {
            await prismaDB.logoutUser(user.id);

            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
            });

            res.status(200).json({ message: 'Logout successful' });
            return
        }
    } catch (err) {
        next(err);
    }
};


export const checkAuthController: RequestHandler = (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const publicUser = mapToPublicUser(user);
    res.status(200).json({ user: publicUser });
};

/**
 * Получение всех подчиненных пользователя, включая его самого
 */
export const getSubordinatesController: RequestHandler = async (req, res, next) => {
    const user = (req as AuthenticatedRequest).user;
    const userId = user.id; // Предполагаем, что ID пользователя уже доступен в req.user после авторизации

    try {
        // Находим всех подчиненных пользователя по managerId
        const result = await prismaDB.getSubordinatesAndSelf(userId);
        console.log(result)
        sendResponse(res, result);
    } catch (error) {
        console.error('Failed to get subordinates:', error);
        next(error);
    }
};
