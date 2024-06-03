const tableNames = require('../../src/constants/tableNames.js');


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	await knex.schema.table(tableNames.team, (table) => {
		table.string('uniq_team_id');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.table(tableNames.team, (table) => {
		table.dropColumn('uniq_tem_id');
	});
};
