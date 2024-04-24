import express from 'express';
import dotenv from 'dotenv'; dotenv.config();
import knex from 'knex';
import { config } from '../../../knexfile.js';

const router = express.Router();

import OpenAI from 'openai';
const apiKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({
	apiKey: apiKey,
});



const completion = await openai.chat.completions.create({
	model: "gpt-3.5-turbo",
	messages: [{ role: 'user', content: 'hello' }],

});
console.log(
	[
		{
			message: completion.data
		}
	]
)
export default router;