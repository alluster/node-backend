import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY

const openai = new OpenAI({
	apiKey: apiKey,
});

export const ChatGPT = async ({ prompt }) => {
	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [{ role: 'user', content: `${prompt}` }],

		});
		if (completion) {
			return completion.choices[0].message.content
		} else {
			return 'A problem was encountered'
		}

	}
	catch (err) { return 'A problem was encountered', console.log(err) }

}