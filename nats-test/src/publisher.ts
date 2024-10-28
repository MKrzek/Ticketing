import nats from 'node-nats-streaming';

console.clear();

// client
const stan = nats.connect('ticketing', 'abc', {url: 'http://localhost:4222'});

stan.on('connect', () => {
	console.log('Publisher connected to nats');

	const data = JSON.stringify({
		id: '12399',
		title: 'concert',
		price: 2110,
	});

	stan.publish('ticket:created', data, () => {
		console.log('event published');
	});
});
