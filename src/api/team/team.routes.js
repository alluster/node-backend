import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../db/knex.js';
const router = express.Router();

router.get('/', async (req, res) => {
	try {
		let data;
		const { id, user_id } = req.query;

		if (id) {
			// If team ID is provided, return the team details
			const team = await db('team')
				.where({ id: id })
				.whereNull('deleted_at')
				.first();

			if (!team) {
				return res.status(404).json({ error: 'Team not found' });
			}
			data = [team]
			res.json(data);
		} else if (!user_id) {
			// If neither team ID nor user ID is provided, return an error
			return res.status(403).json({ error: 'User ID is required' });
		} else {
			// If user ID is provided, return teams that the user belongs to
			const teams = await db('team')
				.join('team_users', 'team.id', '=', 'team_users.team_id')
				.where({ 'team_users.user_id': user_id })
				.whereNull('team.deleted_at')
				.select('team.*');

			res.json(teams);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const { title, description, id, deleted_at, uniq_user_id } = req.body;
	try {
		if (!uniq_user_id) {
			return res.status(403).json({ error: 'uniq_user_id is required' });
		}

		if (id) {
			const updatedRowsCount = await db('team')
				.where({ id: id })
				.update({
					title: title,
					description: description,
					deleted_at: deleted_at ? new Date() : null,
					updated_at: new Date()
				});

			if (updatedRowsCount === 0) {
				return res.status(404).json({ error: 'Team record not found' });
			}
			res.json({ message: 'Team record updated successfully' });
		} else {
			const generated_uniq_id = uuidv4();
			const insertedIds = await db('team').insert({ creator: uniq_user_id, uniq_team_id: generated_uniq_id, title: title, description: description })
				.returning(['id', 'uniq_team_id', 'title']);
			const teamId = insertedIds[0].id;
			const teamName = insertedIds[0].title;
			const uniqTeamId = insertedIds[0].uniq_team_id;
			const newDashboard = await db('dashboard').insert({ title: `${teamName} Dashboard`, description: 'This is your teams first dashboard', uniq_team_id: uniqTeamId })
				.returning('id');
			const dashboardId = newDashboard[0].id;
			await db('data_table').insert({
				title: 'Example Sales Data',
				description: 'This is your dashboard first example data integration to a Google Sheet',
				spreadsheet_id: '1GCpBT61nq2rZqyfgCEFdqKn4CnBOjX-VpfvUjXrlDP8',
				sheet_id: '0',
				dashboard_id: dashboardId,
				uniq_team_id: uniqTeamId
			});

			const userExists = await db('user').where({ uniq_user_id: uniq_user_id }).first();
			if (userExists) {
				await db('team_users').insert({ team_id: teamId, user_id: userExists.id, uniq_team_id: uniqTeamId });
			} else {
				return res.status(404).json({ error: 'User not found' });
			}

			res.status(200).json({ status: 200, insertedIds, message: 'Team record created successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
router.get('/team_users', async (req, res) => {
	try {
		const { uniq_team_id } = req.query;

		if (!uniq_team_id) {
			// If team ID is not provided, return an error
			return res.status(403).json({ error: 'team_id is required' });
		}

		// Get the user IDs associated with the specified team ID
		const teamUsers = await db('team_users')
			.where({ uniq_team_id: uniq_team_id })
			.whereNull('deleted_at')
			.select('user_id');

		if (!teamUsers.length) {
			return res.status(404).json({ error: 'No users found for this team' });
		}

		// Extract user IDs from the teamUsers array
		const userIds = teamUsers.map(user => user.user_id);
		// Fetch user details from the users table using the retrieved user IDs
		const users = await db('user')
			.whereIn('id', userIds)
			.select('id', 'first_name', 'last_name', 'email', 'uniq_user_id');

		return res.json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
export default router;