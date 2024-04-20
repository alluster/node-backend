const express = require('express');
const router = express.Router();
const knex = require('knex');
const config = require('../../../knexfile');
const db = knex(config.development);

router.get('/', async (req, res) => {
	try {
		let data;
		const { id } = req.query;
		if (id) {
			data = await db('user')
				.where({ id: id })
				.whereNull('deleted_at')

				.first();
			if (!data) {
				return res.status(404).json({ error: 'Row not found' });
			}
			data = [data];
			delete data[0].password
		} else {
			res.status(500).json({ error: 'Internal Server Error' });
		}
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { first_name, last_name, id, team_id, deleted_at } = req.body;
	try {
		if (id) {
			const updatedRowsCount = await db('user')
				.where({ id: id })
				.update({
					first_name: first_name,
					last_name: last_name,
					team_id: team_id,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date()
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'User record not found' });
			}

			// Fetch the updated user data from the database
			const updatedUser = await db('user')
				.where({ id: id })
				.first();
			delete updatedUser.password
			res.status(200).json({ status: 'success', message: 'User record updated successfully', user: updatedUser });

		} else {
			res.status(400).json({ error: 'User ID required' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;