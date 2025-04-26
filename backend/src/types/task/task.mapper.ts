import { FullTask, PublicTask } from './task.types.js';
import { TaskWithUsers } from '../../database/queries/task/task.queries.js';

export const mapToPublicTask = (task: TaskWithUsers): PublicTask => ({
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    creator: `${task.creator.firstName} ${task.creator.lastName}`,
    assignee: `${task.assignee.firstName} ${task.assignee.lastName}`,
});

export const mapToFullTask = (task: TaskWithUsers): FullTask => ({
    ...mapToPublicTask(task),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    creatorId: task.creatorId,
    assigneeId: task.assigneeId,
});
