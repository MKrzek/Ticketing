import jwt from 'jsonwebtoken';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
let mongo: any;

declare global {
	var signin: () => string[];
}

beforeAll(async () => {
	process.env.JWT_KEY = 'asdf';
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
	if (mongoose.connection.db) {
		const collections = await mongoose.connection.db.collections();
		for (let collection of collections) {
			await collection.deleteMany();
		}
	}
});

afterAll(async () => {
	if (mongo) {
		await mongo.stop();
	}
	await mongoose.connection.close();
});

global.signin = () => {
	// build a JWT payload to put into a cookie = {"jwt": "jsonwebtokengoeshere"}
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com',
	};

	// JWT payload will have id, email
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// build session object{jwt: MY_JWT}
	const session = {jwt: token};
	// turn that session into JSON

	const sessionJSON = JSON.stringify(session);
	// take JSON  and encode as base64
	const base64 = Buffer.from(sessionJSON).toString('base64');
	// return string with encoded date

	return [`session=${base64}`];
};
