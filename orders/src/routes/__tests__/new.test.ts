import mongoose from 'mongoose';
import request from 'supertest';
import {OrderStatus} from '../../../../common/src/events/types/order-status';
import {app} from '../../app';
import {Order} from '../../models/order';
import {Ticket} from '../../models/ticket';

it('returns an error if the ticket does not exist', async () => {
	const ticketId = new mongoose.Types.ObjectId();
	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ticketId})
		.expect(404);
});

it('returns an error if the ticket is reserved', async () => {
	const ticket = Ticket.build({
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
		.send({ticketId: ticket.id})
		.expect(400);
});

it('reserve a ticket', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();
	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ticketId: ticket.id})
		.expect(201);
});

it.todo('emit event after order was created');
