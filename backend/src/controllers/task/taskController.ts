import { Request, Response, NextFunction } from 'express';
import { prismaDB } from '../../database/queries/queries.js';
import { mapToFullTask } from '../../types/task/task.mapper.js';
import { FullUser } from '../../types/user/user.types.js';
import { Status, Priority } from '@prisma/client';
import { GroupKey, PaginationOptions, PrismaError } from '../../types/serviceTypes/utils.types.js';
import { sendResponse } from '../helpers/responders/responders.js';
import { handlePrismaError } from '../helpers/errorPrisma/useHandleErrorPrisma.js';
import { body, validationResult } from 'express-validator';

interface CustomRequest extends Request {
    user: FullUser;
}

export const validateTask = [
    body('title')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Заголовок обязателен')
        .isString()
        .withMessage('Заголовок должен быть строкой')
        .escape(),

    body('description')
        .optional()
        .trim()
        .isString()
        .withMessage('Описание должно быть строкой')
        .escape(),

    body('dueDate')
        .isISO8601()
        .withMessage('Дата окончания должна быть в формате ISO 8601')
        .optional(),

    body('priority')
        .isIn(['low', 'medium', 'high'])
        .withMessage('Приоритет должен быть одним из: low, medium, high')
        .optional(),

    body('status')
        .isIn(['todo', 'in_progress', 'done', 'canceled'])
        .withMessage('Статус должен быть одним из: К выполнению, В процессе, Выполнена, Отменена')
        .optional(),

    body('assigneeId')
        .isInt()
        .withMessage('Ответственный должен быть валидным ID пользователя')
        .optional()
        .not()
        .isEmpty()
        .withMessage('ID ответственного обязателен, если он указан'),
];

export const getAllTasks = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Чтение параметров пагинации с fallback значениями
        const options: PaginationOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };

        // Получение задач с пагинацией
        const { tasks, pagination } = await prismaDB.getAllUserTasks(req.user.id, options);

        // Отправка ответа с преобразованными задачами
        sendResponse(res, tasks, pagination);
    } catch (err) {
        // Обработка ошибок
        next(err);
    }
}

export const getTasksGroupedByDeadline = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const group = req.query.group as GroupKey;
        console.log(group)
        const options: PaginationOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };

        if (!['today', 'thisWeek', 'future'].includes(group)) {
            console.log(group)
            res.status(400).json({ message: 'Invalid group value' });
            return;
        }

        const result = await prismaDB.getTasksByDueDateGroup(req.user.id, group, options);

        sendResponse(
            res,
            result.tasks.map(mapToFullTask),
            {
                page: result.pagination.page ?? 1,
                limit: result.pagination.limit ?? 10,
                totalItems: result.pagination.totalItems,
                totalPages: result.pagination.totalPages,
            }
        );
    } catch (err) {
        next(err);
    }
};

export const getTasksGroupedByAssignee = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const options: PaginationOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };

        const { groups, pagination } = await prismaDB.getSubordinateTasks(req.user.id, options);
  
        sendResponse(res, groups, pagination);
    } catch (err) {
        next(err);
    }
};

export const createTask = async (
    req: CustomRequest,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
    }
    const userId = req.user.id; // или req.body.userId

    if (isNaN(userId)) {
        res.status(400).json({ error: 'Некорректный ID пользователя' });
        return
    }
    try {
        const { title, description, dueDate, priority, assigneeId, status } = req.body as {
            title: string;
            description: string;
            dueDate: string;
            priority: Priority;
            assigneeId: number;
            status: Status;
        };

        if (Number(assigneeId) !== Number(userId)) {
            const isSub = await prismaDB.isSubordinate(userId, assigneeId);
            if (!isSub) {
                res.status(403).json({ error: 'Вы не можете назначить не подчиненного' });
                return;
            }
        }

        const priorityValue = priority.toUpperCase();
        const statusValue = status.toUpperCase();

        if (!Object.values(Priority).includes(priorityValue as Priority)) {
            res.status(400).json({ error: 'Некорректный приоритет задачи' });
            return;
        }

        if (!Object.values(Status).includes(statusValue as Status)) {
            res.status(400).json({ error: 'Некорректный статус задачи' });
            return;
        }

        const task = await prismaDB.createTask({
            title,
            description,
            dueDate: new Date(dueDate),
            priority: priorityValue as Priority,
            status: statusValue as Status,
            creatorId: Number(userId),
            assigneeId: Number(assigneeId),
        });

        if (!task) {
            res.status(500).json({ error: 'Ошибка при создании задачи' });
            return;
        }

        sendResponse(res, 201);
    } catch (err) {
        const errorResponse = handlePrismaError(err as Error | PrismaError);
        res.status(errorResponse.statusCode).json({
            message: errorResponse.message,
            details: errorResponse.details,
        });
    }
};

export const patchTask = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const taskId = Number(req.params.id);
        const updates = req.body as Partial<{
            title: string;
            description: string;
            dueDate: string;
            priority: Priority;
            status: Status;
            assigneeId: number;
        }>;

        const priorityValue = updates.priority?.toUpperCase();
        const statusValue = updates.status?.toUpperCase();

        if (!Object.values(Priority).includes(priorityValue as Priority)) {
            res.status(400).json({ error: 'Некорректный приоритет задачи' });
            return;
        }

        if (!Object.values(Status).includes(statusValue as Status)) {
            res.status(400).json({ error: 'Некорректный статус задачи' });
            return;
        }

        const task = await prismaDB.getTaskByIdForUser(taskId);

        if (!task) {
            res.status(404).json({ error: 'Задача не найдена' });
            return;
        }

        const isOwner = task.creatorId === req.user.id;
        const isAssignee = task.assigneeId === req.user.id;

        if (!isOwner && !isAssignee) {
            res.status(403).json({ error: 'Нет доступа к редактированию задачи' });
            return;
        }

        if (!isOwner && Object.keys(updates).some((key) => key !== 'status')) {
            res.status(403).json({ error: 'Вы можете изменить только статус' });
            return;
        }

        if ('assigneeId' in updates && updates.assigneeId !== task.assigneeId) {
            const isSub = await prismaDB.isSubordinate(req.user.id, updates.assigneeId!);
            if (!isSub && Number(updates.assigneeId) !== Number(req.user.id)) {
                res.status(403).json({ error: 'Ответственный должен быть подчиненным' });
                return;
            }
        }

        const updated = await prismaDB.patchTask(taskId, {
            ...updates,
            creatorId: Number(req.user.id),
            assigneeId: Number(updates.assigneeId),
            priority: priorityValue as Priority,
            status: statusValue as Status,
            dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
        });

        if (!updated) {
            res.status(500).json({ error: 'Не удалось обновить задачу' });
            return;
        }

        sendResponse(res, 200);
    } catch (err) {
        next(err);
    }
}