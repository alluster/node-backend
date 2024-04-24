import { verify } from '../../utils/jwt.js';
import knex from 'knex';
import config from '../../../knexfile.js';

const db = knex(config.development);

export const validateUser = async (req, res, next) => {
	const authHeader = await req.get('authorization');
	if (authHeader) {
		try {
			const [, token] = authHeader.split(' ');
			const user = await verify(token);
			req.user = user;

			return next();
		} catch (error) {
			console.log(error);
		}
	}
	return next();

};

export const isLoggedIn = (req, res, next) => {
	if (req.user)
		return next();
	const error = new Error('Un-authorized');
	res.status(403);
	return next(error)
}

export const validateTeamAssociation = async (req, res, next) => {
	try {
		let user_id, team_id;
		if (req.method === 'GET') {
			// For GET requests, access parameters from req.query
			user_id = req.query.user_id;
			team_id = req.query.team_id;
		} else if (req.method === 'POST') {
			// For POST requests, access parameters from req.body
			user_id = req.body.user_id;
			team_id = req.body.team_id;
		} else {
			// Handle other request methods if needed
			return res.status(405).json({ error: 'Method Not Allowed' });
		}

		const teamUser = await db('team_users')
			.where({ user_id: user_id, team_id: team_id })
			.whereNull('deleted_at')
			.first();

		if (!teamUser) {
			return res.status(403).json({ error: 'Unauthorized - User not associated with this team' });
		}

		next();
	} catch (error) {
		console.error('Error validating team association:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
