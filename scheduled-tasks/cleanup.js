const db = require('../database/database');
const cron = require('node-cron');

// This will run every week on Monday at 9AM Pacific Time
cron.schedule('0 9 * * 1', async () => {
	try {
		const result = await db.query(`
            DELETE FROM users
            WHERE left_at IS NOT NULL AND left_at < NOW() - INTERVAL '1 week'
        `);
		console.log(`Deleted ${result.rowCount} user(s) from the database.`);
	}
	catch (error) {
		console.error('Failed to delete users from the database:', error);
	}
}, {
	scheduled: true,
	timezone: 'America/Los_Angeles',
});
