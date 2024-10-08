import supertest from 'supertest';
import app from '../../app.js';

describe('GET /api/v1', () => {
	test('should return an message ', async () => {
		const response = await supertest(app)
			.get('/api/v1')
			.expect('Content-Type', /json/)
			.expect(200);
		expect(response.body.message)
			.toEqual('This is the v1 of this API');
	});
})    
