const tableNames = require('../../src/constants/tableNames.cjs');


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	await knex.schema.table(tableNames.team_users, (table) => {
		table.string('uniq_team_id');
	});

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.table(tableNames.team_users, (table) => {
		table.dropColumn('uniq_team_id');

	});

};