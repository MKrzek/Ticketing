import mongoose from 'mongoose';
import {natsWrapper} from './nats-wrapper';
import {app} from './app';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}

	try {
		await natsWrapper.connect('ticketing', 'absdfef', 'http://nats-srv:4222');

		natsWrapper.client.on('close', () => {
			console.log('NATS connecion closed');
			process.exit();
		});
		process.on('SIGINT', () => natsWrapper.client.close());
		process.on('SIGTERM', () => natsWrapper.client.close());

		await mongoose.connect(process.env.MONGO_URI);
		console.log('Connected to MongoDB in tickets');
	} catch (err) {
		console.error(err);
	}
};

app.listen(3000, () => {
	console.log('Listening ticket on 3000!!');
});

start();
