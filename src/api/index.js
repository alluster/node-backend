const express = require('express')
const apiMessage = require('../constants/apiMessage')
const dashboard = require('./dashboard/dashboard.routes')
const google = require('./google/google.routes')
const data_provider = require('./data_provider/data_provider.routes')
const auth = require('./auth/auth.routes')
const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: apiMessage.message
	});
});
router.use('/dashboard', dashboard);
router.use('/google', google);
router.use('/data_provider', data_provider);
router.use('/auth', auth);

module.exports = router;