const tableNames = require('../../src/constants/tableNames.cjs');


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	await knex.schema.table(tableNames.team, (table) => {
		table.integer('ai_requests');
	});

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.table(tableNames.team, (table) => {
		table.dropColumn('ai_requests');

	});

};