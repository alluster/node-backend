const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Import the UUID module

const router = express.Router();
const knex = require('knex');
const config = require('../../../knexfile');
const db = knex(config.development);


router.get('/', async (req, res) => {
	try {
		const { id, user_id } = req.query;

		if (id) {
			// If team ID is provided, return the team details
			const team = await db('team')
				.where({ id: id })
				.whereNull('deleted_at')
				.first();

			if (!team) {
				return res.status(404).json({ error: 'Team not found' });
			}
			data = [team]
			res.json(data);
		} else if (!user_id) {
			// If neither team ID nor user ID is provided, return an error
			return res.status(400).json({ error: 'User ID is required' });
		} else {
			// If user ID is provided, return teams that the user belongs to
			const teams = await db('team')
				.join('team_users', 'team.id', '=', 'team_users.team_id')
				.where({ 'team_users.user_id': user_id })
				.whereNull('team.deleted_at')
				.select('team.*');

			res.json(teams);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { title, description, id, deleted_at, uniq_user_id } = req.body;
	try {
		if (!uniq_user_id) {
			return res.status(400).json({ error: 'uniq_user_id is required' });
		}

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
			const generated_uniq_id = uuidv4();
			const insertedIds = await db('team').insert({ uniq_team_id: generated_uniq_id, title: title, description: description }).returning('id');
			const teamId = insertedIds[0].id;
			const userExists = await db('user').where({ uniq_user_id: uniq_user_id }).first();
			if (userExists) {
				await db('team_users').insert({ team_id: teamId, user_id: userExists.id });
			} else {
				return res.status(404).json({ error: 'User not found' });
			}

			res.json({ insertedIds, message: 'Team record created successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
module.exports = router;