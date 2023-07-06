const { Events } = require('discord.js');
const db = require('../database/database');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		// Extract useful information about the member
		const { id, username, discriminator } = member.user;

		// Formulate a timestamp for when the user joined
		const join_date = new Date();

		// Query to insert a new user or update the existing user's data
		const queryText = `
			INSERT INTO users (discord_id, username, discriminator, join_date, rank, points, left_at, last_message, xp)
			VALUES ($1, $2, $3, $4, $5, $6, NULL, NULL, $7)
			ON CONFLICT (discord_id) DO 
			UPDATE SET username = $2, discriminator = $3, join_date = $4, rank = $5, points = $6, left_at = NULL, last_message = NULL, xp = $7;
		`;

		try {
			await db.query(queryText, [id, username, discriminator, join_date, 0, 0, 0]);
			console.log(`User ${username} has been added/updated in the database.`);
		}
		catch (error) {
			console.error(`Failed to add/update user ${username} in the database:`, error);
		}
	},
};
