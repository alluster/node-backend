import tableNames from '../../src/constants/tableNames';

function addDefaultColumns(table) {
	table.timestamps(false, true);
	table.dateTime('deleted_at');
}


function references(table, tableName) {
	table.integer(`${tableName}_id`).unsigned().references('id').inTable(tableName).onDelete('cascade');
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	await Promise.all([
		await knex.schema.createTable(tableNames.team_users, (table) => {
			table.increments().notNullable();
			addDefaultColumns(table);
			references(table, 'user')
			references(table, 'team')
		})
	])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await Promise.all([
		tableNames.team_users,
	].map((tableName) => knex.schema.dropTableIfExists(tableName)))
};
