const { SlashCommandBuilder } = require('discord.js');
const { ytAPI } = require('../../settings');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('youtubesearch')
		.setDescription('Enter in a search and it will return a youtube video link in a private reply in the chat.')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('The search query')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('number_of_videos')
				.setDescription('use this number to choose how many videos you want to be displayed for you (max is 10)')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();

		try {
			const query = interaction.options.getString('query');
			const num = interaction.options.getInteger('number_of_videos');
			if (num > 10) {
				await interaction.editReply('You can only request a maximum of 10 videos at once.');
				return;
			}

			const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${ytAPI}&type=video`);
			const data = await response.json();
			const videoIds = data.items.slice(0, num).map(item => item.id.videoId);
			const videoUrls = videoIds.map(id => `https://www.youtube.com/watch?v=${id}`);
			interaction.editReply({ content: `Here are the Top ${num} videos I found for you:\n${videoUrls.join('\n')}`, ephemeral: true });

		}
		catch (error) {
			console.log(error);
			interaction.editReply('Error Getting a Youtube Video');
		}
	},
};