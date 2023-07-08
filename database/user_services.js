const db = require('./database.js');
// UPDATE SET username = $2, discriminator = $3, join_date = $4, rank = $5, points = $6, left_at = NULL, last_message = NULL, xp = $7;
const addUserToDB = async (discord_id, username, discriminator, join_date) => {
	try {
		const query = `
        INSERT INTO users (discord_id, username, discriminator, join_date, rank, points, left_at, last_message, xp)
        VALUES ($1, $2, $3, $4, $5, $6, NULL, NULL, $7)
        ON CONFLICT (discord_id) DO NOTHING;
    `;
		const values = [discord_id, username, discriminator, join_date, 0, 0, 0];
		await db.query(query, values);
	}
	catch (error) {
		console.error(`Error adding user ${username} to the database:`, error);
	}
};

module.exports = {
	addUserToDB,
};