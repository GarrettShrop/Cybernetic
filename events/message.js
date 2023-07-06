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

const db = require('../database/database');

module.exports = {
	name: 'messageCreate',
	execute(message) {
		if (message.author.bot) return;

		// XP update code
		db.query('SELECT * FROM users WHERE discord_id = $1', [message.author.id])
			.then(res => {
				if (res.rows.length === 0) {
					// The user does not exist in our database yet, let's insert them.
					// Note: This doesn't handle roles, rank, and left_at as their values are not clear from this context
					db.query('INSERT INTO users (discord_id, username, discriminator, join_date, points) VALUES ($1, $2, $3, $4, $5)',
						[message.author.id, message.author.username, message.author.discriminator, new Date(), 1])
						.catch(e => console.error(e.stack));
				}
				else {
					// The user exists, let's update their points.
					db.query('UPDATE users SET points = points + 1 WHERE discord_id = $1', [message.author.id])
						.catch(e => console.error(e.stack));
				}
			})
			.catch(e => console.error(e.stack));

		// OpenAI interaction code
		if (message.content.includes('cybernetic') || message.content.includes('Cybernetic') || speaker.includes(message.author)) {
			if (!speaker.includes(message.author)) {
				speaker.push(message.author);
			}
			if (finishers.includes(message.content.toLowerCase())) {
				for (let i = 0; i < speaker.length;i++) {
					if (speaker[i] == message.author) {
						speaker.splice(i, 1);
					}
				}
				return;
			}
			message.content.replace('cybernetic', '');
			prompt += `You: ${message.content}\n`;
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
				message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
				prompt += `${gptResponse.data.choices[0].text}\n`;
			})();
		}
	},
};
