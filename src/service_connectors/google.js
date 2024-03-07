require('dotenv').config()
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require("es6-promisify");

const google = async ({ spreadsheetId, sheetId, cell }) => {
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
	const cellValue = sheet.getCellByA1(`${cell}`); // or A1 style notation

	if (!cell) {
		return (
			[
				{
					"sheet": sheet._cells.map((row, rowIndex) => {
						return row.map((cell, columnIndex) => {
							return {
								value: cell.value,
								row: rowIndex,
								column: columnIndex
							};
						});
					})
				}
			]
		)
	}
	else {
		return (
			[
				{ "value": `${cellValue.value}` }
			]
		)
	}

}

module.exports = google;