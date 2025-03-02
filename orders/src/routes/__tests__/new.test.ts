import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from "@mkrzektickets/common";

it('returns an error if the ticket does not exist', async () => {
	const ticketId = new mongoose.Types.ObjectId();
	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId })
		.expect(404);
});

it('returns an error if the ticket is reserved', async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();
	const order = Order.build({
		ticket,
		userId: '12345667',
		status: OrderStatus.Created,
		expiresAt: new Date(),
	});

	await order.save();
	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(400);
});

it('reserve a ticket', async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();
	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(201);
});

it('emit event after order was created', async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});

	await ticket.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
