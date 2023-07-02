const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adminpost')
		.setDescription('Use this command to send patch notes and tease roadmap of future features for users to look at')
		.addStringOption(option => option.setName('type')
			.setDescription('decide which message to send to the server')
			.setRequired(true)
			.addChoices(
				{ name: 'patchnotes', value: 'patchnotes' },
				{ name: 'futurefeatures', value: 'futurefeatures' },
			))
		.addStringOption(option => option.setName('message')
			.setDescription('provide the message to send')
			.setRequired(true)),
	async execute(interaction) {
		try {
			// check to see if the user trying to run the command has the admin role in the server.
			if (!interaction.member.permissions.has('ADMINISTRATOR')) {
				await interaction.reply('You do not have permission to use this command.');
				return;
			}
			// Get the arguments
			const type = interaction.options.getString('type');
			const message = interaction.options.getString('message');

			// Determine the channel to send to based on the type
			let channel;
			if (type === 'patchnotes') {
				channel = interaction.guild.channels.cache.get('1125098548594212935');
			}
			else if (type === 'futurefeatures') {
				channel = interaction.guild.channels.cache.get('1124855092588322927');
			}
			else {
				await interaction.reply('Invalid type.');
				return;
			}

			// Send the message
			const embed = new EmbedBuilder()
				.setTitle(`New ${type.charAt(0).toUpperCase() + type.slice(1)} Message`)
				.setDescription(message)
				.setColor(type === 'patchnotes' ? '#0099ff' : '#ff0000');
			// Different color for different types

			await channel.send({ embeds: [embed] });
			await interaction.reply('Message sent.');
		}
		catch (error) {
			console.log(error);
		}
	},
};