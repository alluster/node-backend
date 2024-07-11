import { verify } from '../../utils/jwt.js';
import db from '../../../db/knex.js';

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
		let user_id;
		let uniq_team_id;

		console.log('Request User:', req.user);

		// Determine user_id based on request method
		if (req.method === 'GET') {
			// Assuming user info is stored in req.user for GET requests
			if (!req.user || !req.user.id) {
				return res.status(400).json({ error: 'user_id is required for GET requests' });
			}
			user_id = req.user.id;
		} else if (req.method === 'POST') {
			// For POST requests, access user_id from req.body
			user_id = req.body.user_id;
		} else {
			return res.status(405).json({ error: 'Method Not Allowed' });
		}

		console.log('User ID:', user_id);

		// Retrieve user information from the user table
		const user = await db('user')
			.where({ id: user_id })
			.first();

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		console.log('User from users table:', user);

		// Retrieve the team information from the team table
		const team = await db('team')
			.where({ id: user.team_id })
			.first();

		if (!team) {
			return res.status(404).json({ error: 'Team not found' });
		}

		console.log('Team from team table:', team);

		// Assign the uniq_team_id from the team data
		uniq_team_id = team.uniq_team_id;

		// Check if the user is associated with the team
		const teamUser = await db('team_users')
			.where({ user_id: user_id, uniq_team_id: uniq_team_id })
			.whereNull('deleted_at')
			.first();

		if (!teamUser) {
			return res.status(403).json({ message: 'Unauthorized - User not associated with this team' });
		}

		// If everything is valid, proceed to the next middleware or route handler
		next();
	} catch (error) {
		console.error('Error validating team association:', error);
		return res.status(500).json({ error: 'Internal Server Error with team association' });
	}
};
