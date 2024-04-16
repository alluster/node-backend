const express = require('express')
const apiMessage = require('../constants/apiMessage')
const dashboard = require('./dashboard/dashboard.routes')
const google = require('./google/google.routes')
const data_provider = require('./data_provider/data_provider.routes')
const auth = require('./auth/auth.routes')
const data_point = require('./data_point/data_point.routes')
const team = require('./team/team.routes')
const user = require('./user/user.routes')

const router = express.Router();
const authMiddlewares = require('../api/auth/auth.middlewares');

router.get('/', (req, res) => {
	res.json({
		message: apiMessage.message
	});
});
router.get('/validateuser', authMiddlewares.isLoggedIn, (req, res) => {
	res.json({ message: 'User is authenticated' });
});

router.use('/auth', auth);

router.use('/dashboard', authMiddlewares.isLoggedIn, dashboard);
router.use('/google', authMiddlewares.isLoggedIn, google);
router.use('/data_provider', authMiddlewares.isLoggedIn, data_provider);
router.use('/data_point', authMiddlewares.isLoggedIn, data_point);
router.use('/team', authMiddlewares.isLoggedIn, team);
router.use('/user', authMiddlewares.isLoggedIn, user);

module.exports = router;