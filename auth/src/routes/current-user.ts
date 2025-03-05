import express, { Request, Response } from 'express';
import { currentUser } from '@mkrzektickets/common';

const router = express.Router();

router.get(
	'/api/users/currentuser',
	currentUser,
	(req: Request, res: Response) => {
		console.log('manual testing -3')
		res.send({ currentUser: req.currentUser || null });
	}
);

export { router as currentUserRouter };
