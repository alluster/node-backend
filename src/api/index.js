import express from 'express';
import { message } from '../constants/apiMessage.js';
import dashboard from './dashboard/dashboard.routes.js';
import data_provider from './data_provider/data_provider.routes.js';
import auth from './auth/auth.routes.js';
import data_point from './data_point/data_point.routes.js';
import team from './team/team.routes.js';
import user from './user/user.routes.js';
import data_table from './data_table/data_table.routes.js';
import { isLoggedIn, validateTeamAssociation } from '../api/auth/auth.middlewares.js';
import llama2 from './llama2/llama2.routes.js';
import invite from './invite/invite.routes.js';
import chatgpt from './chatgpt/chatgpt.routes.js';


const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: message
	});
});

router.get('/validateuser', isLoggedIn, (req, res) => {
	const user = req.user;
	res.json({ user });
});

router.use('/auth', auth);

router.use('/dashboard', isLoggedIn, validateTeamAssociation, dashboard);
router.use('/data_point', isLoggedIn, validateTeamAssociation, data_point);
router.use('/data_table', isLoggedIn, validateTeamAssociation, data_table);
router.use('/llama2', isLoggedIn, validateTeamAssociation, llama2);
router.use('/chatgpt', isLoggedIn, chatgpt);

router.use('/data_provider', isLoggedIn, data_provider);
router.use('/invite', isLoggedIn, invite);
router.use('/team', isLoggedIn, team);
router.use('/user', isLoggedIn, user);


export default router;