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

const updateUserInDB = async (discord_id, xp, points) => {
	try {
		const query = `
        UPDATE users
        SET xp = xp + $2, points = points + $3, last_message = CURRENT_TIMESTAMP
        WHERE discord_id = $1;
		`;
		const values = [discord_id, xp, points];
		await db.query(query, values);
	}
	catch (error) {
		console.error(`Error updating user ${discord_id} in the database:`, error);
	}
};

const loadUserFromDB = async (discord_id) => {

	const query = `
    SELECT * FROM users WHERE discord_id = $1;
        `;
	const values = [discord_id];
	try {
		const result = await db.query(query, values);
		return result.rows[0];
	}
	catch (error) {
		console.error(`Error Loading user ${discord_id} from the database:`, error);
	}
};

const updateRankInDB = async (discord_id, rank) => {
	try {
		const query = `
        UPDATE users
        SET rank = $2
        WHERE discord_id = $1;
        `;
		const values = [discord_id, rank];
		await db.query(query, values);
	}
	catch (error) {
		console.error(`Error updating user rank ${discord_id} in the database:`, error);
	}
};

const getPointsFromDB = async (discord_id) => {
	try {
		const res = await db.query('SELECT points FROM users WHERE discord_id = $1', [discord_id]);
		return res.rows[0] ? res.rows[0].points : null;

	}
	catch (error) {
		console.log(error);
		return null;
	}
};

const deductPointsFromDB = async (discord_id, points) => {
	try {
		const res = await db.query('UPDATE users SET points = points - $1 WHERE discord_id = $2 RETURNING points', [points, discord_id]);
		return res.rows[0] ? res.rows[0].points : null;
	}
	catch (err) {
		console.error(err);
		return null;
	}
};

const addItemToInventory = async (discord_id, item_id) => {
	try {
		await db.query(`
		  INSERT INTO inventory (discord_id, item_id, quantity)
		  VALUES ($1, $2, 1)
		  ON CONFLICT (discord_id, item_id)
		  DO UPDATE SET quantity = inventory.quantity + 1`, [discord_id, item_id]);
		return true;
	}
	catch (err) {
		console.error(err);
		return false;
	}
};

const getItemFromDB = async (item_name) => {
	try {
		const res = await db.query('SELECT * FROM items WHERE item_name = $1', [item_name]);
		return res.rows[0];
	}
	catch (err) {
		console.log(err);
		return null;
	}
};

const addItemToDB = async (item_name, item_description, cost) => {
	const text = 'INSERT INTO items(item_name, item_description, cost) VALUES($1, $2, $3)';
	const values = [item_name, item_description, cost];

	try {
		await db.query(text, values);
	}
	catch (err) {
		console.log(err.stack);
	}
};

const updateLastMessageDateInDB = async (discord_id, date) => {
	const query = 'UPDATE users SET last_message = $1 WHERE discord_id = $2';
	const values = [date, discord_id];
	await db.query(query, values);
};


module.exports = {
	addUserToDB,
	updateUserInDB,
	loadUserFromDB,
	updateRankInDB,
	getPointsFromDB,
	deductPointsFromDB,
	addItemToInventory,
	getItemFromDB,
	addItemToDB,
	updateLastMessageDateInDB,
};