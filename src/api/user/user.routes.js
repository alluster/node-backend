const express = require('express');
const router = express.Router();
const knex = require('knex');
const config = require('../../../knexfile');
const db = knex(config.development);
const yup = require('yup');

const schemaUpdateUser = yup.object().shape({
	team_id: yup.number().integer().positive().required(),
});

router.get('/', async (req, res) => {
	try {
		let data;
		const { id } = req.query;
		if (id) {
			data = await db('user').where({ id: id }).first();
			if (!data) {
				return res.status(404).json({ error: 'Row not found' });
			}
			data = [data]; // Wrap the single record inside an array
		} else {
			data = await db.select().table('user');
		}
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { first_name, last_name, id, deleted_at } = req.body;
	try {
		if (id) {
			const updatedRowsCount = await db('user')
				.where({ id: id })
				.update({
					first_name: first_name,
					last_name: last_name,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date()
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'User record not found' });
			}
			res.json({ message: 'User record updated successfully' });
		} else {

			res.json({ message: 'User ID required' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;