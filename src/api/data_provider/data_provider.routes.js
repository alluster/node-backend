import express from 'express';
import db from '../../../db/knex.js';

const router = express.Router();


router.get('/', async (req, res) => {
	try {
		let data;
		const { id } = req.query;
		if (id) {
			data = await db('data_provider').where({ id: id }).whereNull('deleted_at').first();
			if (!data) {
				return res.status(404).json({ error: 'Row not found' });
			}
			data = [data]; // Wrap the single record inside an array
		} else {
			data = await db.select().whereNull('deleted_at').table('data_provider');
		}
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { title, description, id, deleted_at, service_account } = req.body;
	try {
		if (id) {
			const updatedRowsCount = await db('data_provider')
				.where({ id: id })
				.update({
					title: title,
					description: description,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date(),
					service_account: service_account
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'Data provider record not found' });
			}
			res.json({ message: 'Data provider record updated successfully' });
		} else {
			const insertedIds = await db('data_provider')
				.insert({ title, description, service_account });

			res.json({ id: insertedIds[0], message: 'Data provider record created successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;