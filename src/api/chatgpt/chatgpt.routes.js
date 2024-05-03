import express from 'express';
import dotenv from 'dotenv'; dotenv.config();

import { ChatGPT } from '../../service_connectors/chatgpt.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const { prompt } = req.body;
	try {
		const message = await ChatGPT({ prompt: prompt })
		let data;
		data = [{
			message: message
		}]
		res.status(200).json(data);

	} catch (error) {
		data = [{
			message: error.message
		}]
		console.error(error);
		res.status(500).json(error);
		res.json('The AI could not handle the amount of data.')
	}
});

export default router;