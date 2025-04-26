import { PublicUser } from "../../types/user/user.types.js";
import { AssigneeGroup } from "../../types/serviceTypes/utils.types.js";
import { FullTask } from "../../types/task/task.types.js";

export const groupTasksByAssignee = (
  tasks: (FullTask & { assignee: PublicUser })[]
): AssigneeGroup[] => {
  const groupedMap: Record<number, AssigneeGroup> = {};

  for (const task of tasks) {
    const assigneeId = task.assignee.id;
    if (!groupedMap[assigneeId]) {
      groupedMap[assigneeId] = {
        assignee: task.assignee,
        tasks: [],
      };
    }
    groupedMap[assigneeId].tasks.push(task);
  }

  return Object.values(groupedMap);
};
