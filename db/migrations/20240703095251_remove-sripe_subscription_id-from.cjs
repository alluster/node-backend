const tableNames = require('../../src/constants/tableNames.cjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	await knex.schema.table(tableNames.user, (table) => {
		table.dropColumn('stripe_subscription_id');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.table(tableNames.user, (table) => {
		table.string('stripe_subscription_id');
	});
};