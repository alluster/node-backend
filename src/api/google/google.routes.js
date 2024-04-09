const express = require('express');

const router = express.Router();
const knex = require('knex');
const config = require('../../../knexfile');
const google = require('../../service_connectors/google');
const db = knex(config.development);
const { auth } = require('google-auth-library');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

router.get('/', async (req, res) => {
	const { cell, spreadsheetId, sheetId } = req.query;
	try {
		const response = await google({
			spreadsheetId: spreadsheetId || '',
			sheetId: sheetId || '',
			cell: cell || ''
		})
		res.json(response)
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: 'Internal Server Error' });

	}
});

// router.get('/auth_google', async (req, res) => {
// 	try {
// 		await runReport((error, data) => {
// 			if (error) {
// 				// Handle error
// 				console.error('Error occurred:', error);
// 			} else {
// 				// Send data as response
// 				res.json(data);
// 			}
// 		});
// 	}
// 	catch (err) {
// 		console.log(err)
// 	}
// });

// propertyId = 277435548;

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
// const analyticsDataClient = new BetaAnalyticsDataClient();

// Runs a simple report.
// async function runReport(callback) {
// 	try {
// 		const [response] = await analyticsDataClient.runReport({
// 			property: `properties/${propertyId}`,
// 			dateRanges: [
// 				{
// 					startDate: '2020-03-31',
// 					endDate: 'today',
// 				},
// 			],
// 			dimensions: [
// 				{
// 					name: 'ga:eventCategory'
// 				},
// 				{
// 					name: 'ga:eventAction'
// 				},
// 				{
// 					name: 'ga:eventLabel'
// 				}
// 			],
// 			metrics: [
// 				{
// 					expression: 'ga:totalEvents'
// 				}
// 			]
// 		});

// 		console.log('Report result:');
// 		const result = response.rows.map(row => ({
// 			city: row.dimensionValues[0],
// 			activeUsers: row.metricValues[0],
// 		}));
// 		callback(null, result);
// 	} catch (error) {
// 		console.error('Error running report:', error);
// 		callback(error);
// 	}
// }


// const connectGoogle = async () => {
// 	try {
// 		const keysEnvVar = process.env['GOOGLE_CERT'];
// 		if (!keysEnvVar) {
// 			throw new Error('The $GOOGLE_CERT environment variable was not found!');
// 		}
// 		const keys = JSON.parse(keysEnvVar);
// 		const client = auth.fromJSON(keys);
// 		client.scopes = ['https://www.googleapis.com/auth/cloud-platform'];
// 		const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
// 		const res = await client.request({ url });
// 		console.log(res.data);
// 	}
// 	catch (err) { console.log(err) }


// const connectGoogle = async () => {
// 	try {
// 		const keysEnvVar = process.env['GOOGLE_CERT'];
// 		if (!keysEnvVar) {
// 			throw new Error('The $GOOGLE_CERT environment variable was not found!');
// 		}
// 		const keys = JSON.parse(keysEnvVar);
// 		const client = auth.fromJSON(keys);
// 		client.scopes = ['https://www.googleapis.com/auth/analytics'];
// 		const projectId = process.env.PROJECT_ID
// 		const resourceId = 427739132

// 		const url = `https://dns.googleapis.com/dns/v1/projects/hyperfigures-app/resource/${resourceId}`; // Modify the URL to include the resource ID
// 		const res = await client.request({ url });
// 		console.log(res.data);
// 	} catch (err) {
// 		console.log(err)
// 	}
// }
module.exports = router;


