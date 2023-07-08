const { Events } = require('discord.js');
// const { addUserToDB } = require('../database/user_services');
require('dotenv').config();

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! using ${client.user.tag} credentials`);

		// const guild = client.guilds.cache.get(process.env.GUILD_ID);
		// const members = await guild.members.fetch();

		// members.each(member => {
		// 	if (!member.user.bot) {
		// 		try {
		// 			addUserToDB(member.user.id, member.user.username, member.user.discriminator, member.joinedAt.toISOString());
		// 			console.log(`Adding ${member.user.username} to the database`);
		// 		}
		// 		catch (error) {
		// 			console.log(error);
		// 		}
		// 	}
		// });
	},
};
