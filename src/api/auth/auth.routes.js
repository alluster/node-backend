import express from 'express';

const router = express.Router();
import db from '../../../db/knex.js';
import yup from 'yup';
import bcrypt from 'bcrypt';
import { sign } from '../../utils/jwt.js';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID module
import { CreateStripeCustomer } from '../../service_connectors/stripe.js';

const schema = yup.object().shape({
	first_name: yup.string().trim().min(2).required(),
	last_name: yup.string().trim().min(2).required(),
	email: yup.string().trim().email().required(),
	password: yup
		.string()
		.min(8)
		.max(200)
		.matches(/[^A-Za-z0-9]/, 'password must contain a special character')
		.matches(/[A-Z]/, 'password must contain an uppercase letter')
		.matches(/[a-z]/, 'password must contain a lowercase letter')
		.matches(/[0-9]/, 'password must contain a number')
		.required(),
});
const schemaSignin = yup.object().shape({
	email: yup.string().trim().email().required(),
	password: yup
		.string()
		.min(8)
		.max(200)
		.matches(/[^A-Za-z0-9]/, 'password must contain a special character')
		.matches(/[A-Z]/, 'password must contain an uppercase letter')
		.matches(/[a-z]/, 'password must contain a lowercase letter')
		.matches(/[0-9]/, 'password must contain a number')
		.required(),
});
// Sign up:

router.get('/', async (req, res) => {
	try {
		res.json({
			message: 'Authentication routes ready for user /signup, /signin, /logout'
		})
	}
	catch (err) { console.log(err) }

});

router.post('/signup', async (req, res) => {
	const { first_name, last_name, email, password } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const generatedUserId = uuidv4(); // Generate a UUID for the user

		const existingUser = await db('user').where({ email }).first();
		if (existingUser) {
			throw new Error('Email is already in use');
		}

		// Insert the new user into the database
		const newUser = await db('user')
			.insert({ uniq_user_id: generatedUserId, first_name, last_name, email, password: hashedPassword })
			.returning('id');

		const userId = newUser[0].id;

		// Create a Stripe customer
		const stripeCustomer = await CreateStripeCustomer({ email });

		// Update the user record with the Stripe customer ID
		await db('user').where({ id: userId }).update({ stripe_id: stripeCustomer.id });

		// Fetch the updated user record
		const createdUserWithStripe = await db('user').where({ id: userId }).first();

		delete createdUserWithStripe.password; // Remove the password field

		const payload = {
			id: userId,
			first_name,
			last_name,
			email
		};

		const token = sign(payload);

		return res.json({
			message: 'success',
			user: createdUserWithStripe,
			token: token
		});
	} catch (error) {
		if (error.name === 'ValidationError') {
			// Send validation error details
			return res.status(400).json({ error: error.errors });
		}
		return res.status(400).json({ error: error.message });
	}
});


// Sign in: 

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	try {

		await schemaSignin.validate({ email, password }, {
			abortEarly: false
		});

		const user = await db('user').where({ email }).first().returning('id', 'email', 'password', 'first_name', 'last_name', 'team_id');
		if (!user) {
			const error = new Error('User not found');
			res.status(401)
			throw error;
		}
		const validPassword = await bcrypt.compare(password, user.password)
		if (!validPassword) {
			const error = new Error('Invalid login');
			res.status(401)
			throw error;
		}
		const payload = {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			team_id: user.team_id
		}
		const token = await sign(payload)

		delete user.password
		res.json([{
			message: 'success',
			user: user,
			token: token
		}]);
	} catch (error) {
		res.status(400).json([{ error, message: 'Signin failed' }]);
	}
});



export default router;