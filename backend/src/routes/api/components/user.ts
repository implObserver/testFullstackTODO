import { Router } from 'express';

export const userRouter = Router();

userRouter.post('/signup', async (req, res) => {
  res.send('OK');
});

userRouter.post('/login', async (req, res) => {
  res.send('OK');
});

userRouter.get('/fastlogin', async (req, res) => {
  res.send('OK');
});

userRouter.post('/logout', async (req, res) => {
  res.send('OK');
});

userRouter.get('/refresh-access-token', async (req, res) => {
  res.send('OK');
});

userRouter.get('/refresh-refresh-token', async (req, res) => {
  res.send('OK');
});

