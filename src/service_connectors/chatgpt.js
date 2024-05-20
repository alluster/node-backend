import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
	apiKey: apiKey,
});

const MAX_CHUNK_LENGTH = 2048; // Adjust this as needed, but generally keep within API limits

const splitPromptIntoChunks = (prompt, maxLength) => {
	const chunks = [];
	let currentChunk = '';

	prompt.split(' ').forEach(word => {
		if (currentChunk.length + word.length + 1 <= maxLength) {
			currentChunk += (currentChunk ? ' ' : '') + word;
		} else {
			chunks.push(currentChunk);
			currentChunk = word;
		}
	});

	if (currentChunk) {
		chunks.push(currentChunk);
	}

	return chunks;
};

export const ChatGPT = async ({ prompt }) => {
	try {
		const promptChunks = splitPromptIntoChunks(prompt, MAX_CHUNK_LENGTH);
		const messages = promptChunks.map(chunk => ({ role: 'user', content: chunk }));
		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: messages,
		});

		if (completion) {
			const response = completion.choices[0].message.content;
			console.log('message from chat gpt:', response);
			return response;
		} else {
			return 'A problem was encountered';
		}
	} catch (err) {
		console.log(err);
		return 'A problem was encountered';
	}
};
