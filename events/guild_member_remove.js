const { Events } = require('discord.js');
const db = require('../database/database');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		// Extract useful information about the member
		const { id, username, discriminator } = member.user;

		// Formulate a timestamp for when the user left
		const left_at = new Date();

		// Query to update the user's left_at field in the database
		const queryText = `
        UPDATE users SET left_at = $1 WHERE discord_id = $2;
        `;

		try {
			await db.query(queryText, [left_at, id]);
			console.log(`User ${username}#${discriminator} has left the server.`);
		}
		catch (error) {
			console.error(`Failed to update user ${username}#${discriminator}'s leave time in the database:`, error);
		}
	},
};
