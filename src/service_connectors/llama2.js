const axios = require('axios');

const AskLlama2 = async ({ model, prompt, system, stream, options }) => {
	try {
		const axiosResponse = await axios.post('http://127.0.0.1:11434/api/generate', {
			model,
			prompt,
			system,
			stream,
			options
		});


		console.log('Axios Response:', axiosResponse.data);

	} catch (error) {
		console.error(error);
	}
};

module.exports = {
	AskLlama2
};