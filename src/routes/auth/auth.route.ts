import { Router } from 'express';
import { API_LOGIN } from '../../constants/api';
import { login } from './auth.controller';

export const authRouter = Router();

authRouter.get(API_LOGIN, (req, res) => {
	res.send('WTF');
  });
  
authRouter.post(API_LOGIN, login);

