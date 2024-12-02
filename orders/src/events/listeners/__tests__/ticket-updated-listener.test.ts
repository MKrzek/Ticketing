import { TicketUpdatedEvent } from '@mkrzektickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
	// updates an instance of listener
	const listener = new TicketUpdatedListener(natsWrapper.client);

	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 20,
		title: 'concert',
	});

	await ticket.save();

	const data: TicketUpdatedEvent['data'] = {
		version: ticket.version + 1,
		id: ticket.id,
		title: 'new concert',
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};
	// call the onMessage function with the data object + message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};
	return {listener, data, msg, ticket};
};

it('finds, updates, and saves a ticket', async () => {
	const {listener, data, msg, ticket} = await setup();
	await listener.onMessage(data, msg);
	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket?.title).toEqual(data.title);
	expect(updatedTicket?.price).toEqual(data.price);
	expect(updatedTicket?.version).toEqual(data.version);
});

it('acks the message', async () => {
	const {listener, data, msg} = await setup();
	await listener.onMessage(data, msg);
	expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
	const {data, msg, listener, ticket} = await setup();
	data.version = 10;
	try {
		await listener.onMessage(data, msg);
	} catch (err) {}
	expect(msg.ack).not.toHaveBeenCalled();
});
