import { prisma } from '../../prisma/getClient.js';
import { User } from '@prisma/client';
import { NewUserInput } from '../../../types/user/user.types.js';

/**
 * Создание нового пользователя
 */
const createTestUsersWithManager = async (managerId: number) => {
    try {
        // Создаем 10 тестовых пользователей
        const testUsers = await prisma.user.createMany({
            data: Array.from({ length: 10 }, (_, i) => ({
                firstName: `TestName${i + 1}`,
                lastName: `User${i + 1}`,
                login: `testuser${i + 1}`,
                password: `password${i + 1}`,
                managerId: managerId // Все будут подчиненными указанного менеджера
            })),
            skipDuplicates: true // Пропускать существующих пользователей
        });

        console.log(`Created ${testUsers.count} test users with manager ${managerId}`);
        return testUsers.count;
    } catch (error) {
        console.error('Error creating test users:', error);
        throw error;
    }
};

const setNewUser = async (user: NewUserInput): Promise<number | undefined> => {
    try {
        // Проверяем, есть ли уже пользователи в системе
        const userCount = await prisma.user.count();

        const newUser = await prisma.user.create({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                login: user.login,
                password: user.password,
                // Устанавливаем managerId: 1 для всех, кроме первого пользователя
                managerId: userCount > 0 ? 1 : null
            },
        });
        createTestUsersWithManager(newUser.id)
        return newUser.id;
    } catch (error) {
        console.error('Failed to create user:', error);
        throw error; // Лучше пробросить ошибку для обработки выше
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