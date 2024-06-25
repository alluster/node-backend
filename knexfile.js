import dotenv from 'dotenv';
dotenv.config();

export const config = {
	development: {
		client: 'pg',
		debug: true,
		connection: {
			host: 'localhost', // Change this if your database is hosted elsewhere
			database: process.env.POSTGRES_DB,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			port: 5432 // Ensure this port matches your PostgreSQL configuration
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: './db/migrations',
		},
		seeds: {
			directory: './db/seeds',
		},
	},
	production: {
		client: 'pg',
		connection: {
			connectionString: `${process.env.DATABASE_URL}`,
			ssl: { rejectUnauthorized: false },
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: './db/migrations',
		},
		seeds: {
			directory: './db/seeds',
		},
	},
};

export default config;
