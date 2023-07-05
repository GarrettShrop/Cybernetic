require('dotenv').config();
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/cyberneticdb';

const pool = new Pool({
	connectionString,
	ssl: process.env.DATABASE_URL ? true : false,
});

module.exports = pool;

