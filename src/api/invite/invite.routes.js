import express from 'express';

import knex from 'knex';
import { config } from '../../../knexfile.js';
import yup from 'yup';

const router = express.Router();
const db = knex(config.development);

const schema = yup.object().shape({
	email: yup.string().trim().email().required(),
	uniq_team_id: yup.string().trim().required(),
	uniq_user_id: yup.string().trim().required(),
});

router.get('/', async (req, res) => {
	try {
		const { id, email } = req.query;

		if (id) {
			// If invitation ID is provided, return the specific invitation
			let invitation = await db('invitations')
				.join('team', 'invitations.team_id', '=', 'team.id')
				.where({ 'invitations.id': id })
				.whereNull('team.deleted_at')
				.whereNull('invitations.deleted_at') // Filter out invitations with deleted_at not null
				.select('invitations.*', 'team.*')
				.first();

			if (!invitation) {
				return res.status(404).json({ error: 'Invitation not found' });
			}

			invitation = [invitation];
			invitation[0].team = invitation[0].team ? [invitation[0].team] : [];

			res.json(invitation);
		} else if (email) {
			// If email is provided, return all invitations associated with that email
			let invitations = await db('invitations')
				.join('team', 'invitations.team_id', '=', 'team.id')
				.where({ 'invitations.email': email })
				.whereNull('team.deleted_at')
				.whereNull('invitations.deleted_at') // Filter out invitations with deleted_at not null
				.select('invitations.*', 'team.*');

			invitations = invitations.map(invitation => {
				invitation.team = invitation.team ? [invitation.team] : [];
				return invitation;
			});

			if (!invitations || invitations.length === 0) {
				return res.json([]);
			}

			res.json(invitations);
		} else {
			// If neither invitation ID nor email is provided, return an error
			return res.status(400).json({ error: 'Invitation ID or email is required' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});



router.post('/', async (req, res) => {
	try {
		const { email, uniq_team_id, uniq_user_id } = req.body;

		// Validate request body using Yup schema
		await schema.validate({ email, uniq_team_id, uniq_user_id });

		// Check if the user exists
		const userExists = await db('user').where({ uniq_user_id }).first();
		if (!userExists) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Check if the team exists
		const teamExists = await db('team').where({ uniq_team_id }).first();
		if (!teamExists) {
			return res.status(404).json({ error: 'Team not found' });
		}

		// Create the invitation
		const insertedIds = await db('invitations').insert({ email, team_id: teamExists.id, user_id: userExists.id }).returning('id');
		const invitationId = insertedIds[0];

		res.json({ id: invitationId, message: 'Invitation created successfully' });
	} catch (error) {
		if (error.name === 'ValidationError') {
			return res.status(400).json({ error: error.errors[0] });
		}
		console.error(error);
		res.status(500).json({ status: 500, error: 'Internal Server Error' });
	}
});

router.post('/accept', async (req, res) => {
	try {
		const { id, user_id, team_id } = req.body;

		const existingTeamUser = await db('team_users')
			.where({ user_id: user_id, team_id: team_id }).first();

		if (!existingTeamUser) {
			await db('team_users').insert({ user_id, team_id });
		}
		await db('invitations').where({ id: id }).update({
			deleted_at: new Date(),
		});

		res.json({ message: 'Invitation accepted and user added to team successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: 500, error: 'Internal Server Error' });
	}
});

export default router;