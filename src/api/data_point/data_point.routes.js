const express = require('express');

const router = express.Router();
const knex = require('knex');
const config = require('../../../knexfile');
const google = require('../../service_connectors/google');
const db = knex(config.development);


router.get('/', async (req, res) => {
	try {
		let data;
		const { id, dashboard_id } = req.query;
		if (id) {
			data = await db('data_point').where({ id: id }).whereNull('deleted_at').first();
			if (!data) {
				return res.status(404).json({ error: 'Row not found' });
			}
			data = [data]; // Wrap the single record inside an array
		} else if (dashboard_id) {
			data = await db('data_point').where({ dashboard_id: dashboard_id }).whereNull('deleted_at');
			if (!data || data.length === 0) {
				return res.status(404).json({ error: 'Data not found' });
			}

		} else {
			data = await db.select().table('data_point').whereNull('deleted_at');
		}
		const GetGoogleSheetValue = async ({ spreadsheet_id, sheet_id, cell }) => {
			try {
				const response = await google.GoogleSheetDataPoint({
					spreadsheetId: spreadsheet_id,
					sheetId: sheet_id,
					cell: cell
				});
				// console.log('Response from google', response)
				return response;
			} catch (error) {
				console.error('error from google', error);
				return 'No data'; // or handle error accordingly
			}
		};
		const GetGoogleAnalyticsValue = async ({ propertyId }) => {
			try {
				const response = await google.GoogleAnalytics({
					propertyId: propertyId
				});
				// console.log('Response from google', response)
				return response;
			} catch (error) {
				console.error('error from google', error);
				return 'No data'; // or handle error accordingly
			}
		};
		const AddValueToData = async () => {
			try {
				// Map over the data array and call GetGoogleValue for each item asynchronously
				const promises = data.map(async item => {
					if (item.type === 'google-sheet') {
						const value = await GetGoogleSheetValue({
							spreadsheet_id: item.spreadsheet_id,
							sheet_id: item.sheet_id,
							cell: item.cell
						});
						return { ...item, value }; // Spread operator to add 'value' property
					}
					else if (item.type === 'google-analytics') {
						const value = await GetGoogleAnalyticsValue({
							propertyId: item.property_id
						})
						return { ...item, value }; // Spread operator to add 'value' property


					}
					else {
						const value = await GetGoogleSheetValue({
							spreadsheet_id: item.spreadsheet_id,
							sheet_id: item.sheet_id,
							cell: item.cell
						});
						return { ...item, value }; // Spread operator to add 'value' property
					}

				});

				// Wait for all promises to resolve
				data = await Promise.all(promises);
			} catch (err) {
				// console.log(err);
			}
		};

		// Call the function to add 'value' property to 'data'
		await AddValueToData();
		// Send the modified 'data' array as the response
		res.json(data);
	} catch (error) {
		// console.error('error from google', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
router.get('/google_analytics', async (req, res) => {
	try {
		const analyticsData = await google.GoogleAnalytics()
		res.json(analyticsData)
		console.log(analyticsData)
	} catch (error) {
		console.error('error:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
router.post('/', async (req, res) => {
	const { title, description, id, deleted_at, sheet_id, spreadsheet_id, cell, dashboard_id, type, property_id } = req.body;
	try {
		if (id) {
			const updatedRowsCount = await db('data_point')
				.where({ id: id })
				.update({
					title: title,
					description: description,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date(),
					sheet_id: sheet_id,
					spreadsheet_id: spreadsheet_id,
					cell: cell,
					dashboard_id: dashboard_id
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'Data Point record not found' });
			}
			res.json({ message: 'Data Point record updated successfully' });
		} else {
			const insertedIds = await db('data_point ')
				.insert({
					title: title,
					description: description,
					sheet_id: sheet_id,
					spreadsheet_id: spreadsheet_id,
					cell: cell,
					dashboard_id: dashboard_id,
					type: type,
					property_id: property_id
				});

			res.json({ id: insertedIds[0], message: 'data_point record created successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
module.exports = router;