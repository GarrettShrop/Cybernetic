require('dotenv').config();
const OpenAI = require('openai-api');
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const speaker = [];
const finishers = ['bye', 'goodnight', 'goodbye', 'im out'];
let prompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
Human: Hello, who are you?
AI: I am an AI created by OpenAI. How can I help you today?
Human: How can you help me?
AI:`;

module.exports = {
	name: 'messageCreate',
	execute(messageCreate) {
		if (messageCreate.author.bot) return;
		if (messageCreate.content.includes('cybernetic') || messageCreate.content.includes('Cybernetic') || speaker.includes(messageCreate.author)) {
			if (!speaker.includes(messageCreate.author)) {
				speaker.push(messageCreate.author);
			}
			if (finishers.includes(messageCreate.content.toLowerCase())) {
				for (let i = 0; i < speaker.length;i++) {
					if (speaker[i] == messageCreate.author) {
						speaker.splice(i, 1);
					}
				}
				return;
			}
			messageCreate.content.replace('cybernetic', '');
			prompt += `You: ${messageCreate.content}\n`;
			(async () => {
				const gptResponse = await openai.complete({
					engine: 'text-davinci-003',
					prompt: prompt,
					temperature: 0.5,
					max_tokens: 60,
					top_p: 0.3,
					frequency_penalty: 0.5,
					presence_penalty: 0,
				});
				messageCreate.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
				prompt += `${gptResponse.data.choices[0].text}\n`;
			})();
		}
	},
};