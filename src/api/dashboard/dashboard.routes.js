const express = require('express');

const router = express.Router();
const knex = require('knex');
const config = require('../../../knexfile');
const db = knex(config.development);


router.get('/', async (req, res) => {
	try {
		const data = await db.select().table('dashboard');
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
})

router.post('/', async (req, res) => {
	const { title, description, id, deleted_at } = req.body;
	try {
		if (id) {
			const updatedRowsCount = await db('dashboard')
				.where({ id: id })
				.update({
					title: title,
					description: description,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date()
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'Dashboard record not found' });
			}
			res.json({ message: 'Dashboard record updated successfully' });
		} else {
			const insertedIds = await db('dashboard')
				.insert({ title, description });

			res.json({ id: insertedIds[0], message: 'Dashboard record created successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
module.exports = router;