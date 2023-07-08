const { Events } = require('discord.js');
const addUserToDB = require('../database/user_services.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		// Extract useful information about the member
		const { id, username, discriminator } = member.user;

		// Formulate a timestamp for when the user joined
		const join_date = new Date();

		try {
			addUserToDB(id, username, discriminator, join_date);
			console.log(`User ${username} has been added/updated in the database.`);
		}
		catch (error) {
			console.error(`Failed to add/update user ${username} in the database:`, error);
		}
	},
};
