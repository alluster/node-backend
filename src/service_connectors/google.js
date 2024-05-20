import dotenv from 'dotenv'; dotenv.config();
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { auth } from 'google-auth-library';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const GoogleSheet = async ({ spreadsheetId, sheetId }) => {
	const doc = new GoogleSpreadsheet(spreadsheetId);
	const Cert = process.env.GOOGLE_CERT;
	const ParsedCert = JSON.parse(Cert);

	await doc.useServiceAccountAuth({
		client_email: ParsedCert.client_email,
		private_key: ParsedCert.private_key.replace(/\\n/g, '\n'), // Replace newline characters
	});

	await doc.loadInfo(); // loads document properties and worksheets
	const sheet = doc.sheetsById[sheetId];
	await sheet.loadCells();

	// Extract cell values into JSON format
	const jsonData = [];
	const headerRow = {};
	const columnPresence = new Array(sheet.columnCount).fill(false);

	for (let colIndex = 0; colIndex < sheet.columnCount; colIndex++) {
		const cell = sheet.getCell(0, colIndex); // Assuming header is in the first row
		if (cell.value !== null && cell.value !== '') {
			const columnName = cell.value.toString().trim();
			headerRow[colIndex] = columnName;
			columnPresence[colIndex] = true;
		}
	}
	jsonData.push(headerRow);

	for (let rowIndex = 1; rowIndex < sheet.rowCount; rowIndex++) { // Start from the second row assuming the first row is header
		const row = {};
		let isEmptyRow = true;

		for (let colIndex = 0; colIndex < sheet.columnCount; colIndex++) {
			if (columnPresence[colIndex]) {
				const cell = sheet.getCell(rowIndex, colIndex);
				if (cell.value !== null && cell.value !== '') {
					const columnName = headerRow[colIndex];
					row[columnName] = cell.value;
					isEmptyRow = false;
				}
			}
		}
		if (!isEmptyRow) {
			jsonData.push(row);
		}
	}

	// Remove columns that have no data
	const filteredHeaderRow = {};
	Object.keys(headerRow).forEach((colIndex) => {
		const columnName = headerRow[colIndex];
		if (jsonData.some(row => row.hasOwnProperty(columnName))) {
			filteredHeaderRow[columnName] = headerRow[colIndex];
		}
	});

	// Replace the first element in jsonData with the filtered header row
	jsonData[0] = filteredHeaderRow;

	// Remove the header row keys to keep the output minimal
	jsonData.shift();

	return jsonData;
};




export const GoogleSheetDataPoint = async ({ spreadsheetId, sheetId, cell }) => {
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

export const GoogleAnalytics = async ({
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
