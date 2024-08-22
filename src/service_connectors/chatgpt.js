import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
	apiKey: apiKey,
});

const MAX_CHUNK_LENGTH = 2048; // Keep this within API limits

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
		let messages = [];
		let responseText = '';
		console.log(prompt)

		for (const chunk of promptChunks) {
			messages.push({ role: 'user', content: chunk });

			const completion = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: messages,
			});

			if (completion && completion.choices.length > 0) {
				const response = completion.choices[0].message.content;
				responseText += response + '\n';

				// Add the assistant's response to the messages to maintain the context
				messages.push({ role: 'assistant', content: response });
			} else {
				return 'A problem was encountered';
			}
		}

		// console.log('Full response from ChatGPT:', responseText);
		return responseText.trim(); // Return the full chained response

	} catch (err) {
		console.log(err);
		if (err.code === 'context_length_exceeded') {
			return 'The amount of data sent to the AI is too large. Please upgrade your subscription or send a smaller amount of data ';
		}
		else {
			return `An Error ocurred ${err.message}]`
		}
	}
};
