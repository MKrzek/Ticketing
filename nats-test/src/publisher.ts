import nats from 'node-nats-streaming';
import {TicketCreatedPublisher} from './events/ticket-created-publisher';

console.clear();

// client
const stan = nats.connect('ticketing', 'abc', {url: 'http://localhost:4222'});

stan.on('connect', () => {
	console.log('Publisher connected to nats');

	const publisher = new TicketCreatedPublisher(stan);
	publisher.publish({
		id: '12399',
		title: 'cinema',
		price: 390,
	});

	// const data = JSON.stringify({
	// 	id: '12399',
	// 	title: 'cinema',
	// 	price: 2110,
	// });

	// stan.publish('ticket:created', data, () => {
	// 	console.log('event published');
	// });
});
