import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
	const ticket = {
		title: 'concert',
		price: 20,
	};
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({title: 'concert', price: 20})
		.expect(201);

	const ticketRes = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200);
	console.log(ticketRes.body);

	expect(ticketRes.body.title).toEqual(ticket.title);
	expect(ticketRes.body.price).toEqual(ticket.price);
});
