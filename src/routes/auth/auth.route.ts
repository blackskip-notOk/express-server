import { Router } from 'express';
import { API_LOGIN, API_SINGUP } from '../../constants/api';
import { signup, login } from './auth.controller';

export const authRouter = Router();

authRouter.post(API_SINGUP, signup);

authRouter.get(API_LOGIN, (req, res) => {
	res.send('WTF');
  });

authRouter.post(API_LOGIN, login);

