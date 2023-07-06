const db = require('./database/database');

const addUserToDB = async (userId, username) => {
	try {
		const query = `
      INSERT INTO users (id, username, xp, points, last_message)
      VALUES ($1, $2, 0, 0, CURRENT_TIMESTAMP)
      ON CONFLICT (id)
      DO NOTHING;
    `;
		const values = [userId, username];
		await db.query(query, values);
	}
	catch (error) {
		console.error(`Error adding user ${username} to the database:`, error);
	}
};

module.exports = {
	addUserToDB,
};