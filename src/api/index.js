const express = require('express')
const apiMessage = require('../constants/apiMessage')
const dashboard = require('./dashboard/dashboard.routes')
const google = require('./google/google.routes')
const data_provider = require('./data_provider/data_provider.routes')
const auth = require('./auth/auth.routes')
const data_point = require('./data_point/data_point.routes')

const router = express.Router();
const authMiddlewares = require('../api/auth/auth.middlewares');

router.get('/', (req, res) => {
	res.json({
		message: apiMessage.message
	});
});
router.get('/validateuser', authMiddlewares.isLoggedIn, (req, res) => {
	// If execution reaches here, it means the user is authenticated
	res.json({ message: 'User is authenticated' });
});
router.use('/dashboard', authMiddlewares.isLoggedIn, dashboard);
router.use('/google', authMiddlewares.isLoggedIn, google);
router.use('/data_provider', data_provider);
router.use('/auth', auth);
router.use('/data_point', data_point);


module.exports = router;