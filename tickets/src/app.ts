import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';

import {errorHandler, NotFoundError, currentUser} from '@mkrzektickets/common';
import {createTicketRouter} from './routes/new';

import cookieSession from 'cookie-session';

const app = express();
// traffic is proxied to express through ingress nginx and allows express to trust the connection even when express is behind the proxy
app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);
app.use(currentUser);
app.use(createTicketRouter);

app.all('*', () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export {app};
