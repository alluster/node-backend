const express = require('express');

const router = express.Router();
const knex = require('knex');
const config = require('../../../knexfile');
const db = knex(config.development);


router.get('/', async (req, res) => {
	try {
		let data;
		const { id, dashboard_id } = req.query;
		if (id) {
			data = await db('data_point').where({ id: id }).first();
			if (!data) {
				return res.status(404).json({ error: 'Row not found' });
			}
			data = [data]; // Wrap the single record inside an array
		}
		else if (dashboard_id) {
			data = await db('data_point').where({ dashboard_id: dashboard_id }).first();
			if (!data) {
				return res.status(404).json({ error: 'Row not found' });
			}
			data = [data]; // Wrap the single record inside an array
		}
		else {
			data = await db.select().table('data_point');
		}
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { title, description, id, deleted_at, sheet_id, spreadsheet_id, cell, dashboard_id } = req.body;
	try {
		if (id) {
			const updatedRowsCount = await db('data_point')
				.where({ id: id })
				.update({
					title: title,
					description: description,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date(),
					data_provider_id: data_provider_id,
					sheet_id: sheet_id,
					spreadsheet_id: spreadsheet_id,
					cell: cell,
					dashboard_id: dashboard_id
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'data_point record not found' });
			}
			res.json({ message: 'data_point  record updated successfully' });
		} else {
			const insertedIds = await db('data_point ')
				.insert({ title, description });

			res.json({ id: insertedIds[0], message: 'data_point record created successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
module.exports = router;