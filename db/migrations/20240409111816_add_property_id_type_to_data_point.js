const tableNames = require('../../src/constants/tableNames.js');


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {

	await knex.schema.table(tableNames.data_point, (table) => {

		table.string('property_id');
		table.string('type');

	});



};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.table(tableNames.data_point, (table) => {
		table.dropColumn('property_id');
		table.dropColumn('type');
	});
};
