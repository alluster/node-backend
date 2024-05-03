import express from 'express';
import knex from 'knex';
import { config } from '../../../knexfile.js';
import { GoogleSheet } from '../../service_connectors/google.js';

const db = knex(config.development);
const router = express.Router();


router.get('/', async (req, res) => {
	try {
		let data;
		const { id, dashboard_id, get_data, uniq_team_id } = req.query;
		if (id) {
			data = await db('data_table').where({ id: id, uniq_team_id: uniq_team_id }).whereNull('deleted_at').first();
			if (!data) {
				return res.status(404).json({ error: 'Row not found' });
			}
			data = [data]; // Wrap the single record inside an array
		} else if (dashboard_id) {
			data = await db('data_table').where({ dashboard_id: dashboard_id, uniq_team_id: uniq_team_id }).whereNull('deleted_at');
			if (!data || data.length === 0) {
				return res.status(404).json({ status: 404, error: 'Data not found' });
			}
		} else {
			data = await db.select().table('data_table').where({ uniq_team_id: uniq_team_id }).whereNull('deleted_at');
		}

		const GetGoogleSheet = async ({ spreadsheet_id, sheet_id }) => {
			try {
				const response = await GoogleSheet({
					spreadsheetId: spreadsheet_id,
					sheetId: sheet_id,
				});
				return response;
			} catch (error) {
				console.error('error from google', error);
				return 'No data'; // or handle error accordingly
			}
		};

		const AddDataToData = async () => {
			try {
				const promises = data.map(async item => {
					const value = await GetGoogleSheet({
						spreadsheet_id: item.spreadsheet_id,
						sheet_id: item.sheet_id,
					});
					console.log('value from google', value)
					return { ...item, value };
				});

				data = await Promise.all(promises);
			} catch (err) {
				console.log(err);
			}
		};

		if (get_data) {
			await AddDataToData();
		}

		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { title, description, id, deleted_at, sheet_id, spreadsheet_id, dashboard_id, uniq_team_id } = req.body;
	try {
		if (id) {
			const updatedRowsCount = await db('data_table')
				.where({ id: id })
				.update({
					title: title,
					description: description,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date(),
					sheet_id: sheet_id,
					spreadsheet_id: spreadsheet_id,
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'Data Table record not found' });
			}
			res.json({ message: 'Data Table record updated successfully' });
		} else {
			const insertedIds = await db('data_table ')
				.insert({
					title: title,
					description: description,
					sheet_id: sheet_id,
					spreadsheet_id: spreadsheet_id,
					dashboard_id: dashboard_id,
					uniq_team_id: uniq_team_id

				});

			res.json({ id: insertedIds[0], message: 'data_table record created successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
export default router;