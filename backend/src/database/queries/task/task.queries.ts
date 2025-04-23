import { prisma } from '../../prisma/getClient.js';
import { Task } from '@prisma/client';
import { startOfToday, endOfToday, addDays } from 'date-fns';
import { mapToPublicUser } from '../../../types/user/user.mapper.js';
import { PublicUser } from '../../../types/user/user.types.js';
/**
 * Получение всех задач пользователя (созданных или назначенных)
 */
const getAllUserTasks = async (userId: number): Promise<Task[]> => {
    return await prisma.task.findMany({
        where: {
            OR: [
                { creatorId: userId },
                { assigneeId: userId }
            ]
        },
        orderBy: { updatedAt: 'desc' },
        include: {
            creator: true,
            assignee: true,
        },
    });
};

const getTasksGroupedByDueDate = async (userId: number) => {
    const today = new Date();
    const endOfWeek = addDays(today, 7);

    const allTasks = await getAllUserTasks(userId);

    const todayTasks = allTasks.filter(task => task.dueDate <= endOfToday() && task.dueDate >= startOfToday());
    const weekTasks = allTasks.filter(task => task.dueDate > endOfToday() && task.dueDate <= endOfWeek);
    const futureTasks = allTasks.filter(task => task.dueDate > endOfWeek);

    return {
        today: todayTasks,
        thisWeek: weekTasks,
        future: futureTasks
    };
};

/**
 * Получение задач подчинённых пользователя (если он руководитель)
 */
const getSubordinateTasks = async (managerId: number): Promise<(Task & { assignee: PublicUser })[]> => {
    const subordinates = await prisma.user.findMany({
        where: { managerId },
        select: { id: true },
    });

    const subIds = subordinates.map((u) => u.id);

    const tasks = await prisma.task.findMany({
        where: {
            assigneeId: { in: subIds }
        },
        orderBy: { updatedAt: 'desc' },
        include: {
            creator: false,
            assignee: true,
        },
    });

    return tasks.map(task => ({
        ...task,
        assignee: mapToPublicUser(task.assignee),
    }));
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
const updateTask = async (taskId: number, updates: Partial<Task>): Promise<Task | null> => {
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
    updateTask,
    isSubordinate,
    getTasksGroupedByDueDate,
};