import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import db from '../../../db/knex.js';
import { ChatGPT } from '../../service_connectors/chatgpt.js';

const router = express.Router();

router.post('/', setConnectionTimeout('12h'), async (req, res) => {
	const { prompt, uniq_team_id } = req.body;  // Assume team_id is passed in the request body
	try {
		// Check if the team has a valid subscription
		const team = await db('team').where({ uniq_team_id }).first();

		if (!team) {
			return res.status(404).json({ error: 'Team not found' });
		}

		if (!team.stripe_subscription || !team.stripe_price_id || team.stripe_price_id.length === 0) {
			return res.status(403).json({ message: 'Please subscribe' });
		}

		// Process the prompt with ChatGPT
		const message = await ChatGPT({ prompt });
		let data = [{
			message: message
		}];

		// Increment the ai_requests field by 1
		const updatedRowsCount = await db('team')
			.where({ uniq_team_id })
			.increment('ai_requests', 1)
			.update({
				updated_at: new Date()
			});

		res.status(200).json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'The AI could not handle the amount of data.',
			error: error.message
		});
	}
});

export default router;
