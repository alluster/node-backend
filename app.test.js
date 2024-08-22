import supertest from 'supertest';
import app from './app.js';
import { message } from './src/constants/apiMessage.js';

describe('App', () => {
	test('should respond to a message', async () => {
		const response = await supertest(app)
			.get('/')
			.expect('Content-Type', /json/)
			.expect(200);

		expect(response.body.message).toEqual(message);
	});
});