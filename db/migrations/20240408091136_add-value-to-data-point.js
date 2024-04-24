import tableNames from '../../src/constants/tableNames')


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {

	await knex.schema.table(tableNames.data_point, (table) => {

		table.string('value');
	});



};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.table(tableNames.data_point, (table) => {
		table.dropColumn('value');
	});
};
