import type { Response, Request } from 'express';
import { LoginRejectBody, LoginRequestBody } from './types'
import { ADMIN, ResponseCode } from '../../constants/codes';

export const loginRejectBody: LoginRejectBody = {
	timestamp: new Date(),
	error: 'Unauthorized',
	message: 'Incorrect password for the ADMIN',
	code: ResponseCode.UNAUTHORIZED,
};

export function login(req: Request<unknown, void, LoginRequestBody>, res: Response) {
	const { username, password } = req.body;

	if (!username || !password) {
		res.clearCookie('ADMIN-AUTH');
		res.clearCookie('CANDIDATE-AUTH');
		res.status(ResponseCode.BAD_REQUEST).json(`Need to send ${username ? 'password' : 'username'}`);
	}

	if (username === ADMIN && password !== ADMIN) {
		res.clearCookie('ADMIN-AUTH');
		res.clearCookie('CANDIDATE-AUTH');

		res.status(ResponseCode.UNAUTHORIZED).json(loginRejectBody);
	}

	if (username === ADMIN && password === ADMIN) {
		res.cookie('ADMIN-AUTH', username, { httpOnly: true });
		res.clearCookie('CANDIDATE-AUTH');
		res.sendStatus(ResponseCode.NO_CONTENT);
	}

	if (username !== ADMIN && password !== ADMIN) {
		res.cookie('CANDIDATE-AUTH', username, { httpOnly: true });
		res.clearCookie('ADMIN-AUTH');
		res.sendStatus(ResponseCode.NO_CONTENT);
	}
}

export function logout(_req: Request, res: Response) {
	res.clearCookie('ADMIN-AUTH');
	res.clearCookie('CANDIDATE-AUTH');

	res.sendStatus(ResponseCode.NO_CONTENT);
}

