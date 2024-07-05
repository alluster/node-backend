import express from 'express';
import dotenv from 'dotenv'; dotenv.config();
import db from '../../../db/knex.js';

import { ChatGPT } from '../../service_connectors/chatgpt.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const { prompt, uniq_team_id } = req.body;  // Assume team_id is passed in the request body
	try {
		const message = await ChatGPT({ prompt });
		let data = [{
			message: message
		}];

		// Increment the ai_requests field by 1
		const updatedRowsCount = await db('team')
			.where({ uniq_team_id: uniq_team_id })
			.increment('ai_requests', 1)
			.update({
				updated_at: new Date()
			});

		if (updatedRowsCount) {
			res.status(200).json(data);
		} else {
			res.status(404).json({ error: 'Team not found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'The AI could not handle the amount of data.',
			error: error.message
		});
	}
});

export default router;