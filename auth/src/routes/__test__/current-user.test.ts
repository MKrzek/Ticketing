import request from 'supertest';
import { app } from '../../app';
import { currentUser } from '../../middlewares/current-user';

it('responds with details about current user', async () => {
	const cookie = await global.signin();

	if (!cookie) {
		throw new Error('Cookie not set after signup');
	}
	const response = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.send()
		.expect(200);

	expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responses with null if not authenticated', async () => {
	const response = await request(app)
		.get('/api/users/currentuser')
		.send()
		.expect(200);
	expect(response.body.currentUser).toEqual(null);
});