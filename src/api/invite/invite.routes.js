import express from 'express';
import db from '../../../db/knex.js';
import yup from 'yup';

const router = express.Router();

const schema = yup.object().shape({
	email: yup.string().trim().email()
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

			res.status(200).json(invitation);
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

			res.status(200).json(invitations);
		} else {
			// If neither invitation ID nor email is provided, return an error
			return res.status(403).json({ error: 'Invitation ID or email is required' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});



router.post('/', async (req, res) => {
	try {
		const { email, uniq_team_id, uniq_user_id, title, description, deleted_at, id } = req.body;

		// Validate request body using Yup schema
		await schema.validate({ email });

		const teamExists = await db('team').where({ uniq_team_id: uniq_team_id }).first();
		if (!teamExists) {
			return res.status(404).json({ error: 'Team not found' });
		}
		const userExists = await db('user').where({ uniq_user_id: uniq_user_id }).first();
		if (!userExists) {
			return res.status(404).json({ error: 'User not found' });
		}
		const existingInvitation = await db('invitations')
			.where({ team_id: teamExists.id, email: email })
			.first();

		if (existingInvitation) {
			// If the invitation exists, update it with the new details

			return res.status(202).json({ message: 'User with this email has already been invited to this team.' });
		} else {
			// If the invitation does not exist, create a new one
			const insertedIds = await db('invitations')
				.insert({ email: email, team_id: teamExists.id, user_id: userExists.id, title: title, description: description })
				.returning('id');
			const invitationId = insertedIds[0];
			return res.status(200).json({ id: invitationId, message: 'Invitation created successfully' });
		}
	} catch (error) {
		if (error.name === 'ValidationError') {
			return res.status(403).json({ error: error.errors[0] });
		}
		console.error(error);
		res.status(500).json({ status: 500, error: 'Internal Server Error' });
	}
});

router.post('/accept', async (req, res) => {
	try {
		const { id, user_id, team_id, uniq_team_id } = req.body;

		const existingTeamUser = await db('team_users')
			.where({ user_id: user_id, team_id: team_id, uniq_team_id: uniq_team_id }).first();

		if (!existingTeamUser) {
			await db('team_users').insert({ user_id, team_id, uniq_team_id });
		}
		await db('invitations').where({ id: id }).update({
			deleted_at: new Date(),
		});

		res.status(200).json({ message: 'Invitation accepted and user added to team successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: 500, error: 'Internal Server Error' });
	}
});
router.post('/decline', async (req, res) => {
	try {
		const { id, user_id, team_id, deleted_at } = req.body;


		await db('invitations').where({ id: id }).update({
			deleted_at: new Date(),
		});

		res.status(200).json({ message: 'Invitation declined' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: 500, error: 'Internal Server Error' });
	}
});

export default router;