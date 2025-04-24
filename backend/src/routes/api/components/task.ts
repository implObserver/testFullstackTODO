import { RequestHandler, Router } from 'express';
import { createTask, getAllTasks, getTasksGroupedByAssignee, getTasksGroupedByDeadline, updateTask } from '../../../controllers/task/taskController.js';
import { requireAuth } from '../../../controllers/helpers/auth/requireAuth.js';

export const taskRouter = Router();

// Применяем requireAuth ко всем маршрутам ниже
taskRouter.use(requireAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     PublicUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         login:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         middleName:
 *           type: string
 *           nullable: true
 *     FullTask:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE, CANCELED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creatorId:
 *           type: integer
 *         assigneeId:
 *           type: integer
 */


/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Управление задачами
 *
 * components:
 *   schemas:
 *     PublicTask:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date
 *         priority:
 *           type: string
 *           enum: [HIGH, MEDIUM, LOW]
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE, CANCELED]
 *     FullTask:
 *       allOf:
 *         - $ref: '#/components/schemas/PublicTask'
 *         - type: object
 *           properties:
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *             creatorId:
 *               type: integer
 *             assigneeId:
 *               type: integer
 */

/**
 * @swagger
 * /api/task:
 *   get:
 *     summary: Получить все задачи пользователя с пагинацией
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Номер страницы (по умолчанию 1)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Количество задач на странице (по умолчанию 10)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Список задач с информацией о пагинации
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FullTask'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *             example:
 *               tasks:
 *                 - id: 1
 *                   title: "Подготовить отчёт"
 *                   description: "Финальный отчёт за квартал"
 *                   dueDate: "2025-04-25"
 *                   priority: "HIGH"
 *                   status: "IN_PROGRESS"
 *                   createdAt: "2025-04-20T12:00:00.000Z"
 *                   updatedAt: "2025-04-22T10:00:00.000Z"
 *                   creatorId: 1
 *                   assigneeId: 42
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 5
 *                 totalItems: 47
 */

taskRouter.get('/', getAllTasks as RequestHandler);

/**
 * @swagger
 * /api/task/grouped/deadlines:
 *   get:
 *     summary: Группировка задач по срокам с пагинацией
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Номер страницы (по умолчанию 1)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Количество задач на странице для каждой группы (по умолчанию 10)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Сгруппированные задачи по срокам с пагинацией
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 today:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FullTask'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                 week:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FullTask'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                 future:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FullTask'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 */

taskRouter.get('/grouped/deadlines', getTasksGroupedByDeadline as RequestHandler);

/**
 * @swagger
 * /api/task/grouped/assignees:
 *   get:
 *     summary: Группировка задач по подчинённым с пагинацией
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Номер страницы задач для каждого подчинённого (по умолчанию 1)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Количество задач для каждого подчинённого на странице (по умолчанию 10)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Объект, где ключ — ID подчинённого, а значение — задачи с пагинацией
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   assignee:
 *                     $ref: '#/components/schemas/PublicUser'
 *                   tasks:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/FullTask'
 *                   pagination:
 *                     type: object
 *                     properties:
 *                       page:
 *                         type: integer
 *                       limit:
 *                         type: integer
 *                       totalPages:
 *                         type: integer
 *                       totalItems:
 *                         type: integer
 */

taskRouter.get('/grouped/assignees', getTasksGroupedByAssignee as RequestHandler);


/**
 * @swagger
 * /api/task:
 *   post:
 *     summary: Создать задачу
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - dueDate
 *               - priority
 *               - assigneeId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               assigneeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Задача создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FullTask'
 */
taskRouter.post('/', createTask as RequestHandler);

/**
 * @swagger
 * /api/task/{id}:
 *   patch:
 *     summary: Обновить задачу
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE, CANCELED]
 *               assigneeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Задача обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FullTask'
 */
taskRouter.patch('/:id', updateTask as RequestHandler);