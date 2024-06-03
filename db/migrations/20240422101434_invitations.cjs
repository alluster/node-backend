const tableNames = require('../../src/constants/tableNames.js');

function addDefaultColumns(table) {
	table.timestamps(false, true);
	table.dateTime('deleted_at');
}
function addTitleColumns(table) {
	table.string('title', 255);
	table.string('description', 1000);
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
		await knex.schema.createTable(tableNames.invitations, (table) => {
			table.increments().notNullable();
			addTitleColumns(table)
			addDefaultColumns(table);
			references(table, 'user')
			references(table, 'team')
			table.string('sheet_id');
			table.string('email');
		})
	])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await Promise.all([
		tableNames.invitations,
	].map((tableName) => knex.schema.dropTableIfExists(tableName)))
};
