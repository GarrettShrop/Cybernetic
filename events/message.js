require('dotenv').config();
const { loadUserFromDB, updateUserInDB } = require('../database/user_services.js');
const OpenAI = require('openai-api');
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const speaker = [];
const finishers = ['bye', 'goodnight', 'goodbye', 'im out'];
let prompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
Human: Hello, who are you?
AI: I am an AI created by OpenAI. How can I help you today?
Human: How can you help me?
AI:`;
const bonusTopics = ['rocket league', 'garretts46', 'NA', 'stream', 'help'];
let dailyTopic = bonusTopics[Math.floor(Math.random() * bonusTopics.length)];

console.log(`Todays bonus topic is : ${dailyTopic}`);
// Changes topic every 24 hours
setInterval(() => {
	dailyTopic = bonusTopics[Math.floor(Math.random() * bonusTopics.length)];
}, 86400000);

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		try {
			if (message.author.bot) return;

			// XP update code
			// standard XP gain per message
			// standard point gain per message
			let xpGain = 10;
			let pointGain = 1;

			if (message.content.includes(dailyTopic)) {
				console.log('users message does contain the daily topic');
				await updateUserInDB(message.author.id, xpGain + 10, pointGain + 2);
			}
			else {
				console.log('users message does not contain the daily topic');
				await updateUserInDB(message.author.id, xpGain, pointGain);
			}

			// Load the user's info from the database
			const user = await loadUserFromDB(message.author.id);
			const lastMessageDate = user.last_message;
			const today = new Date();

			// If the user sent a message yesterday, give them a bonus
			if (lastMessageDate.getDate() === today.getDate() - 1 && lastMessageDate.getMonth() === today.getMonth() && lastMessageDate.getFullYear() === today.getFullYear()) {
				console.log('Giving user a bonus for regualr messages');
				pointGain += 10, xpGain = 20;
				await updateUserInDB(message.author.id, xpGain, pointGain);
			}


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
		}
		catch (error) {
			console.log(error);
		}
	},
};
