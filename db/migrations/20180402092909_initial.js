
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('list', function(table) {
      table.increments('id').primary();
      table.string('item');
      table.boolean('packed');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('list')
  ])
};
