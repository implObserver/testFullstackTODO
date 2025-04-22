import express from 'express';
import { useDevMiddlewares } from './use/dev/index.js';
export const app = express();

useDevMiddlewares();