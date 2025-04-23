import { RequestHandler, Router } from 'express';
import { requireAuth } from '../../../app/use/util/index.js';
import { createTask, getAllTasks, getTasksGroupedByAssignee, getTasksGroupedByDeadline, updateTask } from '../../../controllers/task/taskController.js';

export const taskRouter = Router();

// Применяем requireAuth ко всем маршрутам ниже
taskRouter.use(requireAuth);

taskRouter.get('/', getAllTasks as RequestHandler);
taskRouter.get('/grouped/deadlines', getTasksGroupedByDeadline as RequestHandler);
taskRouter.get('/grouped/assignees', getTasksGroupedByAssignee as RequestHandler);
taskRouter.post('/', createTask as RequestHandler);
taskRouter.patch('/:id', updateTask as RequestHandler);