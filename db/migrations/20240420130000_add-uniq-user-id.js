const tableNames = require('../../src/constants/tableNames.js');


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	await knex.schema.table(tableNames.user, (table) => {
		table.string('uniq_user_id');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.table(tableNames.user, (table) => {
		table.dropColumn('uniq_user_id');
	});
};
