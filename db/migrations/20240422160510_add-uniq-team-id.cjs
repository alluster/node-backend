const tableNames = require('../../src/constants/tableNames.js');


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	await knex.schema.table(tableNames.invitations, (table) => {
		table.string('uniq_team_id');
	});
	await knex.schema.table(tableNames.dashboard, (table) => {
		table.string('uniq_team_id');
	});
	await knex.schema.table(tableNames.data_point, (table) => {
		table.string('uniq_team_id');
	});
	await knex.schema.table(tableNames.data_table, (table) => {
		table.string('uniq_team_id');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.table(tableNames.invitations, (table) => {
		table.dropColumn('uniq_team_id');
	});
	await knex.schema.table(tableNames.dashboard, (table) => {
		table.dropColumn('uniq_team_id');
	});
	await knex.schema.table(tableNames.data_point, (table) => {
		table.dropColumn('uniq_team_id');
	});
	await knex.schema.table(tableNames.data_table, (table) => {
		table.dropColumn('uniq_team_id');
	});
};