require('dotenv').config();
const OpenAI = require('openai-api');
const openai = new OpenAI(process.env.OPENAI_API_KEY);
let speaker;
let prompt =`The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
Human: Hello, who are you?
AI: I am an AI created by OpenAI. How can I help you today?
Human: I'd like to cancel my subscription.
AI:`;

module.exports = {
	name: 'messageCreate',
	execute(messageCreate) {
        if (messageCreate.author.bot) return;
        if (messageCreate.content.includes('cybernetic')||messageCreate.content.includes('Cybernetic') || speaker == messageCreate.author){
            speaker = messageCreate.author;
            messageCreate.content.replace('cybernetic','');
        prompt += `You: ${messageCreate.content}\n`;
        (async () => {
            const gptResponse = await openai.complete({
                engine: 'text-davinci-002',
                prompt: prompt,
                temperature: 0.9,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.6,
            });
            messageCreate.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
            prompt += `${gptResponse.data.choices[0].text}\n`;
        })();
    }
	},
};