import { prisma } from '../../prisma/getClient.js';
import { Task } from '@prisma/client';
import { startOfToday, endOfToday, addDays } from 'date-fns';
import { mapToPublicUser } from '../../../types/user/user.mapper.js';
import { PublicUser } from '../../../types/user/user.types.js';
import { getPagination } from '../../../controllers/helpers/getPagination.js';
import { GroupKey, PaginationOptions } from '../../../types/serviceTypes/utils.types.js';

/**
 * Получение всех задач пользователя (созданных или назначенных)
 */
export const getAllUserTasks = async (
    userId: number,
    options: PaginationOptions
): Promise<{
    tasks: Task[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}> => {
    const { skip, take } = getPagination(options);
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const [tasks, totalItems] = await Promise.all([
        prisma.task.findMany({
            where: {
                OR: [{ creatorId: userId }, { assigneeId: userId }]
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take,
            include: {
                creator: true,
                assignee: true,
            },
        }),
        prisma.task.count({
            where: {
                OR: [{ creatorId: userId }, { assigneeId: userId }]
            },
        }),
    ]);

    return {
        tasks,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
        },
    };
};



const getTaskByIdForUser = async (
    taskId: number
): Promise<Task | null> => {
    return await prisma.task.findFirst({
        where: {
            id: taskId,
        },
        include: {
            creator: true,
            assignee: true,
        },
    });
};

export const getTasksByDueDateGroup = async (
    userId: number,
    group: GroupKey,
    options: PaginationOptions
) => {
    const { skip, take } = getPagination(options);

    const todayStart = startOfToday();
    const todayEnd = endOfToday();
    const weekEnd = addDays(todayEnd, 7);

    let dateFilter: unknown = {};

    if (group === 'today') {
        dateFilter = { gte: todayStart, lte: todayEnd };
    } else if (group === 'thisWeek') {
        dateFilter = { gt: todayEnd, lte: weekEnd };
    } else if (group === 'future') {
        dateFilter = { gt: weekEnd };
    } else {
        throw new Error('Invalid group value');
    }

    const [tasks, totalCount] = await Promise.all([
        prisma.task.findMany({
            where: {
                AND: [
                    {
                        OR: [{ creatorId: userId }, { assigneeId: userId }],
                    },
                    {
                        dueDate: dateFilter as Date,
                    },
                ],
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take,
            include: {
                creator: true,
                assignee: true,
            },
        }),
        prisma.task.count({
            where: {
                AND: [
                    {
                        OR: [{ creatorId: userId }, { assigneeId: userId }],
                    },
                    {
                        dueDate: dateFilter as Date,
                    },
                ],
            },
        }),
    ]);

    return {
        group,
        tasks,
        pagination: {
            page: options.page,
            limit: options.limit,
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / (options.limit ?? 10)),
        },
    };
};

/**
 * Получение задач подчинённых пользователя (если он руководитель)
 */
const getSubordinateTasks = async (
    managerId: number,
    options: PaginationOptions
): Promise<{
    tasks: (Task & { assignee: PublicUser })[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}> => {
    const { skip, take } = getPagination(options);
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const subordinates = await prisma.user.findMany({
        where: { managerId },
        select: { id: true },
    });

    const subIds = subordinates.map((u) => u.id);

    const [tasks, totalItems] = await Promise.all([
        prisma.task.findMany({
            where: {
                assigneeId: { in: subIds }
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take,
            include: {
                creator: false,
                assignee: true,
            },
        }),
        prisma.task.count({
            where: {
                assigneeId: { in: subIds }
            },
        }),
    ]);

    return {
        tasks: tasks.map(task => ({
            ...task,
            assignee: mapToPublicUser(task.assignee),
        })),
        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
        },
    };
};

/**
 * Создание новой задачи
 */
const createTask = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task | null> => {
    try {
        return await prisma.task.create({
            data,
        });
    } catch (error) {
        console.error('Failed to create task:', error);
        return null;
    }
};

/**
 * Обновление задачи по ID
 */
const patchTask = async (taskId: number, updates: Partial<Task>): Promise<Task | null> => {
    try {
        return await prisma.task.update({
            where: { id: taskId },
            data: updates,
        });
    } catch (error) {
        console.error('Failed to update task:', error);
        return null;
    }
};

const updateTask = async (taskId: number, updates: Task): Promise<Task | null> => {
    try {
        return await prisma.task.update({
            where: { id: taskId },
            data: updates,
        });
    } catch (error) {
        console.error('Failed to update task:', error);
        return null;
    }
};

/**
 * Проверка, является ли пользователь подчинённым
 */
const isSubordinate = async (managerId: number, userId: number): Promise<boolean> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { managerId: true },
    });
    return user?.managerId === managerId;
};

export const taskQueries = {
    getAllUserTasks,
    getSubordinateTasks,
    createTask,
    patchTask,
    isSubordinate,
    getTasksByDueDateGroup,
    getTaskByIdForUser,
    updateTask,
};