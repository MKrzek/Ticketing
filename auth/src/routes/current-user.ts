import express, { Request, Response } from 'express';
import { currentUser } from '@mkrzektickets/common';

const router = express.Router();

router.get(
	'/api/users/currentuser',
	currentUser,
	(req: Request, res: Response) => {

		console.log('Again testing')
		res.send({ currentUser: req.currentUser || null });
	}
);

export { router as currentUserRouter };
