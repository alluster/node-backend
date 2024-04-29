import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY

const openai = new OpenAI({
	apiKey: apiKey,
});

export const ChatGPT = async ({ prompt }) => {
	try {
		console.log(prompt)
		const completion = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [{ role: 'user', content: `${prompt}` }],

		});
		if (completion) {
			return completion.choices[0].message.content
		}

	}
	catch (err) { console.log(err) }

}