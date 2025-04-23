import { Request, Response, NextFunction } from 'express';
import { prismaDB } from '../../database/queries/queries.js';
import { mapToFullTask } from '../../types/task/task.mapper.js';
import { groupTasksByAssignee } from '../../app/use/util/groupTasksByAssignee.js';
import { FullUser } from '../../types/user/user.types.js';
import { Status, Priority } from '@prisma/client'; // если ты используешь enum из Prisma

interface CustomRequest extends Request {
  user: FullUser;
}

export const getAllTasks = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await prismaDB.getAllUserTasks(req.user.id);
    res.json(tasks.map(mapToFullTask));
  } catch (err) {
    next(err);
  }
};

export const getTasksGroupedByDeadline = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const grouped = await prismaDB.getTasksGroupedByDueDate(req.user.id);
    res.json({
      today: grouped.today.map(mapToFullTask),
      thisWeek: grouped.thisWeek.map(mapToFullTask),
      future: grouped.future.map(mapToFullTask),
    });
  } catch (err) {
    next(err);
  }
};

export const getTasksGroupedByAssignee = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await prismaDB.getSubordinateTasks(req.user.id);
    const grouped = groupTasksByAssignee(tasks);
    res.json(grouped);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, dueDate, priority, assigneeId } = req.body as {
      title: string;
      description: string;
      dueDate: string;
      priority: Priority;
      assigneeId: number;
    };

    if (assigneeId !== req.user.id) {
      const isSub = await prismaDB.isSubordinate(req.user.id, assigneeId);
      if (!isSub) {
        res.status(403).json({ error: 'Вы не можете назначить не подчиненного' });
        return;
      }
    }

    const task = await prismaDB.createTask({
      title,
      description,
      dueDate: new Date(dueDate),
      priority,
      status: Status.TODO,
      creatorId: req.user.id,
      assigneeId,
    });

    if (!task) {
      res.status(500).json({ error: 'Ошибка при создании задачи' });
      return;
    }

    res.status(201).json(mapToFullTask(task));
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
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

    const allTasks = await prismaDB.getAllUserTasks(req.user.id);
    const task = allTasks.find((t) => t.id === taskId);

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
      if (!isSub && updates.assigneeId !== req.user.id) {
        res.status(403).json({ error: 'Ответственный должен быть подчиненным' });
        return;
      }
    }

    const updated = await prismaDB.updateTask(taskId, {
      ...updates,
      dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
    });

    if (!updated) {
      res.status(500).json({ error: 'Не удалось обновить задачу' });
      return;
    }

    res.json(mapToFullTask(updated));
  } catch (err) {
    next(err);
  }
};
