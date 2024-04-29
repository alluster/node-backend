import express from 'express';
import knex from 'knex';
import config from '../../../knexfile.js';

const db = knex(config.development);

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		let data;
		const { id, uniq_team_id } = req.query;
		if (id) {
			data = await db('dashboard')
				.where({ id: id, uniq_team_id: uniq_team_id })
				.whereNull('deleted_at')
				.first();
			if (!data) {
				return res.status(404).json({ error: 'Row not found' });
			}
			data = [data]; // Wrap the single record inside an array
		} else {
			data = await db('dashboard')
				.where({ uniq_team_id: uniq_team_id })
				.whereNull('deleted_at');
		}
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { title, description, id, deleted_at, uniq_team_id } = req.body;
	try {
		if (id) {
			const updatedRowsCount = await db('dashboard')
				.where({ id: id })
				.update({
					title: title,
					description: description,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date(),
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'Dashboard record not found' });
			}
			res.status(200).json({ message: 'Dashboard record updated successfully' });
		} else {
			const insertedIds = await db('dashboard')
				.insert({
					title: title, description: description, uniq_team_id: uniq_team_id
				});

			res.status(200).json({ id: insertedIds[0], message: 'Dashboard record created successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;
