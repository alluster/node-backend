const { Pool } = require('pg');
const pool = new Pool({
	host: process.env.POSTGRES_HOST,
	port: 5432,
	database: process.env.POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
})

module.exports = pool