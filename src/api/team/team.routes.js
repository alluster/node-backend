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
			data = await db('team').where({ id: id }).first();
			if (!data) {
				return res.status(404).json({ error: 'Row not found' });
			}
			data = [data]; // Wrap the single record inside an array
		} else {
			data = await db.select().table('team');
		}
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { title, description, id, deleted_at } = req.body;
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
			const insertedIds = await db('team')
				.insert({ title: title, description: description });

			res.json({ id: insertedIds[0], message: 'Team record created successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
module.exports = router;