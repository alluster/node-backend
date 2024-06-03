import dotenv from 'dotenv';
dotenv.config();

export const config = {
	development: {
		client: 'pg',
		debug: false,
		connection: {
			host: process.env.POSTGRES_HOST,
			database: process.env.POSTGRES_DB,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
		},

		pool: {
			min: 2,
			max: 10
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
			connectionString: process.env.DATABASE_URL,
			ssl: { rejectUnauthorized: false },
		},
		migrations: {
			directory: __dirname + '/db/migrations',
		},
		seeds: {
			directory: __dirname + '/db/seeds',
		},
	},
};

export default config