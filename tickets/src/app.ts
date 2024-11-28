import 'express-async-errors';

import { currentUser, errorHandler, NotFoundError } from '@mkrzektickets/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';

import { indexTicketRouter } from './routes';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { updateTicketRouter } from './routes/update';

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
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', () => {
	throw new NotFoundError();
});

app.use(errorHandler as any);

export {app};
