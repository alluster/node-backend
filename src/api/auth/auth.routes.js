const express = require('express');

const router = express.Router();
const knex = require('knex');
const config = require('../../../knexfile');
const db = knex(config.development);
const yup = require('yup');
const bcrypt = require('bcrypt');
const jwt = require('../../utils/jwt');
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
		const hashedPassword = await bcrypt.hash(password, 12)

		const existingUser = await db('user').where({ email }).first();
		if (existingUser) {
			throw new Error('Email is already in use');
		}

		const validUser = await schema.validate({ first_name, last_name, email, password }, {
			abortEarly: false
		});
		const newUser = await db('user').insert({ first_name, last_name, email, password: hashedPassword }).returning('id');
		const createdUser = await db('user').where({ id: newUser[0].id }).first();

		delete createdUser.password
		const payload = {
			id: newUser[0].id,
			first_name,
			last_name,
			email
		}
		const token = await jwt.sign(payload)
		res.json({
			message: 'User created',
			user: createdUser,
			token: token
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});


// Sign in: 

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	try {

		await schemaSignin.validate({ email, password }, {
			abortEarly: false
		});

		const user = await db('user').where({ email }).first().returning('id', 'email', 'password', 'first_name', 'last_name');
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
			email: user.email
		}
		const token = await jwt.sign(payload)

		delete user.password
		res.json([{
			message: 'success',
			user: user,
			token: token
		}]);
	} catch (error) {
		res.status(400).json([{ message: 'Signin failed' }]);
	}
});



module.exports = router;