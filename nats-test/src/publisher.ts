import nats from 'node-nats-streaming';
import {TicketCreatedPublisher} from './events/ticket-created-publisher';

console.clear();

// client
const stan = nats.connect('ticketing', 'abc', {url: 'http://localhost:4222'});

stan.on('connect', async () => {
	console.log('Publisher connected to nats');

	const publisher = new TicketCreatedPublisher(stan);
	try {
		await publisher.publish({
			id: '12399',
			title: 'cinnnema',
			price: 390,
		});
	} catch (err) {
		console.log(err);
	}

	// const data = JSON.stringify({
	// 	id: '12399',
	// 	title: 'cinema',
	// 	price: 2110,
	// });

	// stan.publish('ticket:created', data, () => {
	// 	console.log('event published');
	// });
});
