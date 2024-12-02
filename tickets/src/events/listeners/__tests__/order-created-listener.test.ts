import { OrderCreatedEvent, OrderStatus } from '@mkrzektickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);
	const ticket = Ticket.build({
		title: 'concert',
		price: 99,
		userId: 'asksks',
	});
	await ticket.save();

	const data: OrderCreatedEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: '1111',
		expiresAt: 'ajsjsjsjs',
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return {listener, ticket, msg, data};
};

it('sets the userId of the ticket', async () => {
	const {listener, ticket, data, msg} = await setup();
	await listener.onMessage(data, msg);
	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket?.orderId).toEqual(data.id);
});

it('call the ack message', async () => {
	const {listener, data, msg} = await setup();
	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticekt updated event', async () => {
	const {listener, data, msg} = await setup();
	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const ticketUpdatedData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);
	expect(data.id).toEqual(ticketUpdatedData.orderId);
});
