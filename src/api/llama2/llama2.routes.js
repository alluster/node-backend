const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const { AskLlama2 } = require('../../service_connectors/llama2');

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
module.exports = router;
