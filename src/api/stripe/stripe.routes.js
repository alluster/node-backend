import express from 'express';
const router = express.Router();
import { CreteCustomer, GetCustomer } from '../../utils/stripe.js';


router.get('/customer', async (req, res) => {
	const { id } = req.query;
	try {
		const cus = await GetCustomer({ id: id })
		res.status(200).json({ data: cus, message: 'Customer data retrieved successfully' });

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/customer', async (req, res) => {
	const { email } = req.body;
	try {
		const cus = await CreteCustomer({ email: email })
		res.json({ data: cus, message: 'Customer record created successfully' });

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
export default router;