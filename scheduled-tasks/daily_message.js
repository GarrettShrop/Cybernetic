const { Client, EmbedBuilder } = require('discord.js');
const cron = require('node-cron');
const fetch = require('node-fetch');
require('dotenv').config();

async function fetchQuote() {
	const response = await fetch('https://zenquotes.io/api/random');
	const data = await response.json();
	return data[0].q + ' -' + data[0].a;
}

async function fetchImage() {
	// replace with your own image API call
	const response = await fetch(`https://api.unsplash.com/photos/random/?client_id=${process.env.UNSPLASH_KEY}&orientation=landscape&query=Mountain%20background`);
	const data = await response.json();
	return data.urls.regular;
}

// This will run every day at 8AM Los Angeles Time
cron.schedule('0 8 * * *', async () => {
	const client = new Client();
	try {
		const channel = client.channels.cache.get('1125415504144764970');
		const quote = await fetchQuote();
		const image_url = await fetchImage();
		const embed = new EmbedBuilder()
			.setDescription(quote)
			.setImage(image_url);

		channel.send({ content: '@here', embeds: [embed] });
	}
	catch (error) {
		console.log(error);
		const channel_error = client.channels.cache.get('1000839085302235270');
		channel_error.send('Error sending message');
	}
}, {
	scheduled: true,
	timezone: 'America/Los_Angeles',
});
