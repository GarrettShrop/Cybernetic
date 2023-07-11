const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Displays all the shop items currently on sale'),
	async execute(interaction) {
		await interaction.deferReply();

		try {
			const embed = new EmbedBuilder()
				.setColor(0xEFFF00)
				.setTitle('Cybernetic Shop')
				.setDescription('Here are the items you can purchase:')
				.addFields(
					{ name: 'XP Boost', value: 'Converts 1000 points to 500 XP. Cost: 1000 points', inline: false },
					{ name: '1v1 Rocket League Match against garretts46', value: 'Have a match against the legendary garretts46! Cost: 3000 points', inline: false },
					{ name: 'VIP Role', value: 'Access to VIP-only channels, unique reactions, and highlighted messages. Cost: 5000 points', inline: false },
					{ name: 'Custom Role', value: 'Create a custom role with a name of your choice. Cost: 7000 points', inline: false },
					{ name: 'Discord Nitro for 1 month', value: 'Gifted a Discord Nitro subscription for 1 month. Cost: 10000 points', inline: false },
				);
			await interaction.editReply({ embeds: [embed] });
		}
		catch (error) {
			console.log(error);
			await interaction.editReply('There was a error displaying the shop :(');
		}
	},
};