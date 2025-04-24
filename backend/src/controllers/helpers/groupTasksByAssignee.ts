import { Task } from '@prisma/client';
import { PublicUser } from '../../types/user/user.types.js';

export interface TaskWithAssignee extends Task {
  assignee: PublicUser;
}

export const groupTasksByAssignee = (
  tasks: (Task & { assignee: PublicUser })[]
) => {
  const grouped: Record<number, { assignee: PublicUser; tasks: Task[] }> = {};

  for (const task of tasks) {
    const assigneeId = task.assignee.id;
    if (!grouped[assigneeId]) {
      grouped[assigneeId] = {
        assignee: task.assignee,
        tasks: [],
      };
    }
    grouped[assigneeId].tasks.push(task);
  }

  return grouped;
};

