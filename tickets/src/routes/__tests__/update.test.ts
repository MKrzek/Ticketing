import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import {natsWrapper} from '../../nats-wrapper';

it('returns a 404 if the provided id does not exit', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({title: 'hello', price: 20})
		.expect(404);
});

it('returns a 401 if the user does not own the ticket', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({title: 'Titlel', price: 20});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({title: 'hello1', price: 100})
		.expect(401);
});

it('returns a 400 if the proviced an invalid title or price', async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({title: 'Title', price: 20});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({title: '', price: 20})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({title: 'hell', price: -20})
		.expect(400);
});

it('updates the ticket provided valid inputs', async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({title: 'Title', price: 20});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({title: 'new title', price: 100})
		.expect(200);

	const ticketRes = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();
	expect(ticketRes.body.title).toEqual('new title');
	expect(ticketRes.body.price).toEqual(100);
});

it('publishes an event', async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({title: 'Title', price: 20});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({title: 'new title', price: 100})
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
