import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from '../../../swaggerOptions.js';

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerRouter = Router();

swaggerRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));