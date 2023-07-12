const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadUserFromDB } = require('../../database/user_services.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('me')
		.setDescription('gets all your info like Rank, XP, Points, and joined Date'),
	async execute(interaction) {
		await interaction.deferReply();

		try {
			const user = await loadUserFromDB(interaction.user.id);
			const embed = new EmbedBuilder()
				.setColor(0xEFFF00)
				.setTitle(user.username)
				.setThumbnail(interaction.user.displayAvatarURL())
				.addFields(
					{ name: 'Rank:', value: `${user.rank}`, inline: true },
					{ name: 'XP:', value: `${user.xp}`, inline: true },
					{ name: 'Points:', value: `${user.points}`, inline: true },
					{ name: 'Joined Date:', value: `${user.join_date}`, inline: true },
				);

			interaction.editReply({ embeds: [embed] });
		}
		catch (err) {
			console.log(err);
			await interaction.editReply('There was a error fetching the data :(');
		}
	},
};