exports.up = function (knex) {
	return knex.schema.table('invitations', function (table) {
		table.dropColumn('sheet_id');
	});
};

exports.down = function (knex) {
	return knex.schema.table('invitations', function (table) {
		table.string('sheet_id');
	});
};