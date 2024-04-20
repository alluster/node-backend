const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Import the UUID module

const router = express.Router();
const knex = require('knex');
const config = require('../../../knexfile');
const db = knex(config.development);


router.get('/', async (req, res) => {
	try {
		let data;
		const { id } = req.query;
		if (id) {
			data = await db('team').where({ id: id }).whereNull('deleted_at').first();
			if (!data) {
				return res.status(404).json({ error: 'Row not found' });
			}
			data = [data]; // Wrap the single record inside an array
		} else {
			data = await db.select().whereNull('deleted_at').table('team');
		}
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { title, description, id, deleted_at, uniq_user_id } = req.body;
	try {
		if (id) {
			const updatedRowsCount = await db('team')
				.where({ id: id })
				.update({
					title: title,
					description: description,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date()
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'Team record not found' });
			}
			res.json({ message: 'Team record updated successfully' });
		} else {
			const generated_uniq_id = await uuidv4(); // Generate a UUID for the team record

			// Insert the team record
			const insertedIds = await db('team').insert({ uniq_team_id: generated_uniq_id, title: title, description: description }).returning('id');
			const teamId = insertedIds[0];

			// If a unique user ID is provided, add the user to the team
			if (uniq_user_id) {
				// Check if the user exists
				const userExists = await db('users').where({ uniq_user_id: uniq_user_id }).first();
				if (userExists) {
					// Add the user to the team's array of users
					await db('team_users').insert({ team_id: teamId, user_id: userExists.id });
				} else {
					return res.status(404).json({ error: 'User not found' });
				}
			}

			res.json({ id: teamId, message: 'Team record created successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
module.exports = router;