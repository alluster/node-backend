import tableNames from '../../src/constants/tableNames.js';

function references(table, tableName) {
	table.integer(`${tableName}_id`).unsigned().references('id').inTable(tableName).onDelete('cascade');
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	await knex.schema.table(tableNames.user, (table) => {
		references(table, 'team')
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.table(tableNames.user, (table) => {
		table.dropColumn('team_id');
	});
};
