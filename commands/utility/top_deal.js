const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topdeal')
		.setDescription('Responds with the best game deal for PC users and checks multiple sites'),
	async execute(interaction) {
		await interaction.deferReply();

		try {
			const requestOptions = {
				method: 'GET',
				redirect: 'follow',
			};

			const apiRes = await fetch('https://www.cheapshark.com/api/1.0/deals?sortBy=Deal%20Rating&pageSize=1', requestOptions);
			const data = await apiRes.json();
			const deal = data[0];
			const embed = new EmbedBuilder()
				.setColor(0xEFFF00)
				.setTitle(deal.title)
				.setURL(`https://www.metacritic.com${deal.metacriticLink}`)
				.setThumbnail(deal.thumb)
				.addFields(
					{ name: 'Original Price', value: `$${deal.normalPrice}`, inline: true },
					{ name: 'Discounted Price', value: `$${deal.salePrice}`, inline: true },
					{ name: 'Savings', value: `$${deal.savings}`, inline: true },
					{ name: 'Metacritic Score', value: deal.metacriticScore, inline: true },
					{ name: 'Steam Rating', value: `${deal.steamRatingText} (${deal.steamRatingPercent}%)`, inline: true },
				);

			interaction.editReply({ embeds: [embed] });
		}
		catch (error) {
			console.log(error);
			await interaction.editReply('There was a error fetching the data :(');
		}
	},
};