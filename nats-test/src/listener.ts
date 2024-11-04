import {randomBytes} from 'crypto';
import nats from 'node-nats-streaming';
import {TicketCreatedListener} from './events/ticket-created-listener';

console.clear();
// client

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
	url: 'http://localhost:4222',
});

// send custom info back to nats streaming service that listener received messge
// if we do not send an acknowledgement message back to nats streaming service, then nats streaming
// after some time will try to send the message/event to another listener from the same queue group
// run: k get pods
// run: k port-forward pod-name 8222:8222
// go to localhost:8222/streaming  - to see monitoring data

// setDeliveredAllAv  option will make sure that the first time we run this listener, all events
// that were unprocessed and were waiting in the channel to be processed, will be processed
// setDurableName will make sure that the event that was processed, will not be processed again in a situation
// when a listener is down and then back again
// const options = stan
// 	.subscriptionOptions()
// 	.setManualAckMode(true)
// 	.setDeliverAllAvailable()
// 	.setDurableName('order-service');

stan.on('connect', () => {
	console.log('Listener connected to nats');

	stan.on('close', () => {
		console.log('NATS connection closed');
		process.exit();
	});

	new TicketCreatedListener(stan).listen();
	// const subscription = stan.subscribe(
	// 	'ticket:created',
	// 	'order-service-queue-group',
	// 	options
	// );
	// subscription.on('message', (msg: Message) => {
	// 	const data = msg.getData();
	// 	if (typeof data === 'string') {
	// 		console.log(`Received event #${msg.getSequence()}, with data: ${data}}`);
	// 	}
	// 	msg.ack();
	// });
});

// interrupt and terminate request that are sent to this program are going to be intercepted
// and we will try to close the  nats server connection
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
