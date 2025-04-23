import { Task } from '@prisma/client';
import { FullTask, PublicTask } from './task.types.js';

export const mapToPublicTask = (task: Task): PublicTask => ({
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
});

export const mapToFullTask = (task: Task): FullTask => ({
    ...mapToPublicTask(task),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    creatorId: task.creatorId,
    assigneeId: task.assigneeId,
});
