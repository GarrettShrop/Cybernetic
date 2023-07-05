require('dotenv').config();
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/cyberneticdb';

const pool = new Pool({
	connectionString,
	ssl: {
		rejectUnauthorized: false,
	},
});

module.exports = pool;

