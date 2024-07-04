const tableNames = require('../../src/constants/tableNames.cjs');


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	await knex.schema.table(tableNames.team, (table) => {
		table.string('stripe_price_id');
		table.boolean('stripe_subscription');
	});

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.table(tableNames.team, (table) => {
		table.dropColumn('stripe_price_id');
		table.dropColumn('stripe_subscription');

	});

};