require('dotenv').config()
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require("es6-promisify");
const { auth } = require('google-auth-library');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');


const GoogleSheet = async ({ spreadsheetId, sheetId, cell }) => {
	const doc = new GoogleSpreadsheet(`${spreadsheetId}`);
	const Cert = process.env.GOOGLE_CERT;
	const ParsedCert = JSON.parse(Cert);
	await doc.useServiceAccountAuth({
		client_email: ParsedCert.client_email,
		private_key: ParsedCert.private_key,
	});

	await doc.loadInfo(); // loads document properties and worksheets
	const sheet = doc.sheetsById[`${sheetId}`]; // or use doc.sheetsById[id]
	await sheet.loadCells()
	const c6 = sheet.getCellByA1(`${cell}`); // or A1 style notation
	return (
		c6.value || 'No value'
	)
}

const GoogleAnalytics = async ({
	propertyId
}) => {
	try {
		const keysEnvVar = process.env['GOOGLE_CERT'];
		if (!keysEnvVar) {
			throw new Error('The $GOOGLE_CERT environment variable was not found!');
		}
		const keys = JSON.parse(keysEnvVar);
		const client = auth.fromJSON(keys);
		client.scopes = ['https://www.googleapis.com/auth/analytics'];

		// Run a report using Google Analytics Data API
		const property_id = propertyId || 277435548; // Replace 'YOUR_PROPERTY_ID' with your actual property ID
		const analyticsDataClient = new BetaAnalyticsDataClient();
		const [response] = await analyticsDataClient.runReport({
			property: `properties/${property_id}`,
			dateRanges: [
				{
					startDate: '2020-03-31',
					endDate: 'today',
				},
			],
			dimensions: [
				// {
				// 	name: 'city',
				// },
			],
			metrics: [
				{
					name: 'activeUsers',
				},
			],
		});

		response.rows.forEach(row => {
			return (row.dimensionValues[0], row.metricValues[0]);
		});
		console.log(response)

		return response.rows[0].metricValues[0].value;
	} catch (err) {
		console.log(err);
		throw new Error('Failed to connect and run report');
	}
};

module.exports = {
	GoogleSheet,
	GoogleAnalytics
};