import express from 'express';
const router = express.Router();
import db from '../../../db/knex.js';
import { GetStripeCustomer } from '../../service_connectors/stripe.js';

router.get('/', async (req, res) => {
	try {
		const { id, email } = req.query;
		if (id) {
			// Fetch user data
			let data = await db('user')
				.where({ id: id })
				.whereNull('deleted_at')
				.first();

			if (!data) {
				return res.status(404).json({ error: 'User not found' });
			}

			// Remove sensitive information like password
			delete data.password;

			// Initialize team property as an empty array
			data.team = [];

			// If the user has a team_id, fetch team data and add it to the user object
			if (data.team_id) {
				const teamData = await db('team')
					.where({ id: data.team_id })
					.whereNull('deleted_at')
					.first();

				// Set team data if found
				if (teamData) {
					data.team = [teamData];
				} else {
					// If team data is not found, remove team_id from user
					data.team_id = null;
				}
			}
			// Fetch user invitations matching the user's email
			const userInvitations = await db('invitations')
				.join('team', 'invitations.team_id', '=', 'team.id')
				.where({ 'invitations.email': data.email })
				.whereNull('team.deleted_at')
				.whereNull('invitations.deleted_at') // Exclude invitations with deleted_at not null
				.select('invitations.*');

			// Add invitations array to user object
			data.invitations = userInvitations || [];

			const stripeProfile = await GetStripeCustomer({ id: data.stripe_id })
			data.stripe_profile = stripeProfile || []
			// Send the modified user object with team data and invitations
			return res.json([data]);
		} else {
			return res.status(400).json({ error: 'Missing user ID' });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { first_name, last_name, id, team_id, deleted_at } = req.body;
	try {
		if (id) {
			const updatedRowsCount = await db('user')
				.where({ id: id })
				.update({
					first_name: first_name,
					last_name: last_name,
					team_id: team_id,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date()
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'User record not found' });
			}

			// Fetch the updated user data from the database
			const updatedUser = await db('user')
				.where({ id: id })
				.first();
			delete updatedUser.password
			res.status(200).json({ status: 'success', message: 'User record updated successfully', user: updatedUser });

		} else {
			res.status(400).json({ error: 'User ID required' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;