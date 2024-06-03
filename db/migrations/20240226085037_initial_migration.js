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
		knex.schema.createTable(tableNames.user, (table) => {
			table.increments().notNullable();
			table.string('first_name', 255).notNullable();
			table.string('last_name', 255).notNullable();
			table.string('email', 255).notNullable().unique();
			table.string('password', 255).notNullable();
			table.dateTime('last_login');
			addDefaultColumns(table);
		})

	])

	await knex.schema.createTable(tableNames.team, (table) => {
		table.increments().notNullable();
		addTitleColumns(table);
		addDefaultColumns(table);
		references(table, 'user')

	});
	await knex.schema.createTable(tableNames.dashboard, (table) => {
		table.increments().notNullable();
		addTitleColumns(table)
		addDefaultColumns(table);
		references(table, 'user')
		references(table, 'team')
	});
	await knex.schema.createTable(tableNames.data_provider, (table) => {
		table.increments().notNullable();
		addTitleColumns(table)
		addDefaultColumns(table);
		table.string('service_account');
	});
	await knex.schema.createTable(tableNames.data_point, (table) => {
		table.increments().notNullable();
		addTitleColumns(table)
		addDefaultColumns(table);
		references(table, 'user')
		references(table, 'dashboard')
		references(table, 'data_provider')
		table.string('sheet_id');
		table.string('spreadsheet_id');
		table.string('cell');
		table.string('value');
	});

	await knex.schema.createTable(tableNames.dashboard_public, (table) => {
		table.increments().notNullable();
		references(table, 'user')
		references(table, 'team')
		addTitleColumns(table)
		addDefaultColumns(table);
		table.json('data_json');
	});

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await Promise.all([
		tableNames.dashboard,
		tableNames.data_point,
		tableNames.dashboard_public,
		tableNames.data_provider,
		tableNames.team,
		tableNames.user,

	].map((tableName) => knex.schema.dropTableIfExists(tableName)))
};
