import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();
	return ticket;
};

it('fetches orders for a partcular user', async () => {
	const ticketOne = await buildTicket();
	const ticketTwo = await buildTicket();
	const ticketThree = await buildTicket();

	const user1 = global.signin();
	const user2 = global.signin();
	await request(app)
		.post('/api/orders')
		.set('Cookie', user1)
		.send({ticketId: ticketOne.id})
		.expect(201);

	const {body: order1} = await request(app)
		.post('/api/orders')
		.set('Cookie', user2)
		.send({ticketId: ticketTwo.id})
		.expect(201);

	const {body: order2} = await request(app)
		.post('/api/orders')
		.set('Cookie', user2)
		.send({ticketId: ticketThree.id})
		.expect(201);

	const response = await request(app)
		.get('/api/orders')
		.set('Cookie', user2)
		.expect(200);

	expect(response.body.length).toEqual(2);
	expect(response.body[0].id).toEqual(order1.id);
	expect(response.body[1].id).toEqual(order2.id);
	expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
	expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
