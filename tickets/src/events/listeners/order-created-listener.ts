import { Listener, OrderCreatedEvent, Subjects } from '@mkrzektickets/common';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;
	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		// get a ticket that order is reserving
		const ticket = await Ticket.findById(data.ticket.id);

		if (!ticket) {
			throw new Error('Ticket not found');
		}
		// save ticket
		ticket.set({ orderId: data.id });
		await ticket.save();

		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			orderId: ticket.orderId,
			version: ticket.version,
		});

		// ack the message
		msg.ack();
	}
}
