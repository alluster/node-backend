const supertest = require('supertest');

const app = require('./app');
const apiMessage = require('./src/constants/apiMessage')

describe('App', () => {
	test('should response to a message', async () => {
		const response = await supertest(app)
			.get('/')
			.expect('Content-Type', /json/)
			.expect(200);

		expect(response.body.message).toEqual(apiMessage.message)
	})
});