import { prisma } from '../../prisma/getClient.js';
import { User } from '@prisma/client';
import { NewUserInput } from '../../../types/user/user.types.js';

/**
 * Создание нового пользователя
 */
const setNewUser = async (user: NewUserInput): Promise<number | undefined> => {
    try {
        const newUser = await prisma.user.create({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                login: user.login,
                password: user.password,
            },
        });

        return newUser.id;
    } catch (error) {
        console.error('Failed to create user:', error);
    }
};

/**
 * Установка refresh токена
 */
const setToken = async (id: number, token: string): Promise<void> => {
    await prisma.user.update({
        where: { id },
        data: { refreshToken: token },
    });
};

/**
 * Логаут пользователя (обнуление токена)
 */
const logoutUser = async (userId: number): Promise<void> => {
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
};

/**
 * Поиск пользователя по ID
 */
const findUser = async (id: number): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

const findUserByLogin = async (login: string) => {
    const user = await prisma.user.findFirst({
        where: { login },
    });
    return user;
};

const getSubordinatesAndSelf = async (
    userId: number
): Promise<{ id: number; name: string }[]> => {
    try {
        // Находим всех подчиненных пользователя и самого пользователя в одном запросе
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { managerId: userId }, // Подчиненные
                    { id: userId },         // Сам текущий пользователь
                ],
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
        });

        const res = users.map((user) => ({
            id: user.id,
            name: user.id === userId ? 'Вы' : `${user.firstName} ${user.lastName}`,
        }));
        // Формируем список с именами пользователей, помечая самого пользователя как "Вы"
        return res
    } catch (error) {
        console.error('Failed to get subordinates and self:', error);
        throw error;
    }
};

export const userQueries = {
    findUser,
    setNewUser,
    setToken,
    logoutUser,
    findUserByLogin,
    getSubordinatesAndSelf,
};