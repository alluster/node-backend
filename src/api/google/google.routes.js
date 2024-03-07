const express = require('express');

const router = express.Router();
const knex = require('knex');
const config = require('../../../knexfile');
const google = require('../../service_connectors/google');
const db = knex(config.development);


router.get('/', async (req, res) => {
	const { cell, spreadsheetId, sheetId } = req.query;
	try {
		const response = await google({
			spreadsheetId: spreadsheetId,
			sheetId: sheetId,
			cell: cell
		})
		res.json(response)
	}
	catch (err) {
		console.log(err)
	}


});


module.exports = router;