import express from 'express';
const router = express.Router();
import { AskLlama2 } from '../../service_connectors/llama2.js';

router.post('/', async (req, res) => {
	try {
		const { model, prompt, system, stream, options } = req.body;
		console.log(req.body)
		const response = await AskLlama2({
			model: model,
			prompt: prompt,
			system: system,
			stream: stream,
			options: options
		});
		res.json({ response: response, message: 'data for you sir' });



	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
export default router;