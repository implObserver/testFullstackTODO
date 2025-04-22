import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

import { NextFunction, Request, Response } from 'express';
import { prismaDB } from '../../../database/queries/queries.js';
import { getRefreshToken } from '../../../app/use/dev/auth/token/JWT/issueJWT.js';

interface NewUserInput {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName?: string;
}

export const user_create_post = asyncHandler(async (req, res, next) => {
    const typedReq = req as Request<Record<string, never>, unknown, NewUserInput>;
    const typedRes = res as Response;
    const typedNext = next as NextFunction;
    await Promise.all([
        body('login')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Login must be at least 3 characters long.')
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Login must contain only letters, numbers, and underscores.')
            .escape()
            .run(typedReq),
        body('password')
            .trim()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters.')
            .escape()
            .run(typedReq),
        body('firstName').trim().notEmpty().escape().run(typedReq),
        body('lastName').trim().notEmpty().escape().run(typedReq),
        body('middleName').optional().trim().escape().run(typedReq),
    ]);

    const errors = validationResult(typedReq);
    if (!errors.isEmpty()) {
        typedRes.status(400).json({ error: errors.array()[0].msg });
        return;
    }

    const hashPassword = await bcrypt.hash(typedReq.body.password, 10);
    const userPg: NewUserInput & { password: string } = {
        login: typedReq.body.login,
        firstName: typedReq.body.firstName,
        lastName: typedReq.body.lastName,
        middleName: typedReq.body.middleName || undefined,
        password: hashPassword,
    };

    const existingUser = await prismaDB.findUserByLogin(userPg.login);
    if (existingUser) {
        typedRes.status(403).json({ error: 'Такой логин уже занят' });
        return;
    }

    const id = await prismaDB.setNewUser(userPg);
    if (!id) {
        typedRes.status(500).json({ error: 'Не удалось создать пользователя.' });
        return;
    }

    const refreshToken = getRefreshToken(id).token;
    await prismaDB.setToken(id, refreshToken);
    const user = await prismaDB.findUser(id);

    typedRes.locals.user = user;
    typedRes.locals.refreshToken = refreshToken;
    typedNext(); // вызов только next — больше ничего не возвращаем
});


