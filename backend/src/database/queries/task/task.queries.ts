import { prisma } from '../../prisma/getClient.js';
import { Prisma, Task } from '@prisma/client';
import { startOfToday, endOfToday, addDays } from 'date-fns';
import { mapToPublicUser } from '../../../types/user/user.mapper.js';
import { PublicUser } from '../../../types/user/user.types.js';
import { getPagination } from '../../../controllers/helpers/getPagination.js';
import { GroupKey, PaginationOptions } from '../../../types/serviceTypes/utils.types.js';
import { FullTask } from '../../../types/task/task.types.js';
import { mapToFullTask } from '../../../types/task/task.mapper.js';

/**
 * Получение всех задач пользователя (созданных или назначенных)
 */
export type TaskWithUsers = Prisma.TaskGetPayload<{
    include: { creator: true; assignee: true };
}>;

export const getAllUserTasks = async (
    userId: number,
    options: PaginationOptions
): Promise<{
    tasks: FullTask[];
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

    const fullTasks: FullTask[] = tasks.map(task => mapToFullTask(task));

    return {
        tasks: fullTasks,
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
    groups: { assignee: PublicUser; tasks: FullTask[] }[];
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

    // 1. Получаем всех подчиненных (включая их данные)
    const subordinates = await prisma.user.findMany({
        where: { managerId },
    });

    // 2. Добавляем самого менеджера в список
    const manager = await prisma.user.findUnique({
        where: { id: managerId },
    });

    if (!manager) {
        throw new Error('Manager not found');
    }

    const allAssignees = [...subordinates, manager];
    const assigneeIds = allAssignees.map(u => u.id);

    // 3. Получаем задачи для всех пользователей
    const [tasks, totalItems] = await Promise.all([
        prisma.task.findMany({
            where: {
                assigneeId: { in: assigneeIds }
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take,
            include: {
                assignee: true,
                creator: true // Добавляем creator если нужно для FullTask
            },
        }),
        prisma.task.count({
            where: {
                assigneeId: { in: assigneeIds }
            },
        }),
    ]);

    // 4. Группируем задачи по исполнителям
    const groupedMap: Record<number, { assignee: PublicUser; tasks: FullTask[] }> = {};

    // 5. Инициализируем группы для всех исполнителей
    for (const assignee of allAssignees) {
        groupedMap[assignee.id] = {
            assignee: mapToPublicUser(assignee),
            tasks: []
        };
    }

    // 6. Заполняем задачи в соответствующие группы
    for (const task of tasks) {
        const fullTask: FullTask = {
            ...task,
            creator: `${task.creator.firstName} ${task.creator.lastName}`,
            assignee: `${task.assignee.firstName} ${task.assignee.lastName}`,
        };
        groupedMap[task.assigneeId].tasks.push(fullTask);
    }

    // 7. Преобразуем в массив и фильтруем пустые группы
    const groups = Object.values(groupedMap).filter(group => group.tasks.length > 0);

    return {
        groups,
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
    console.log('userId:', userId);
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { managerId: true },
        });

        if (!user) {
            console.warn(`Пользователь с id ${userId} не найден`);
            return false;
        }

        return user.managerId === managerId;
    } catch (error) {
        console.error('Ошибка при запросе isSubordinate:', error);
        return false;
    }
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