const express = require('express')
const apiMessage = require('../constants/apiMessage')
const dashboard = require('./dashboard/dashboard.routes')
const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: apiMessage.message
	});
});
router.use('/dashboard', dashboard);

module.exports = router;