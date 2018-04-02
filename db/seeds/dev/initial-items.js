
exports.seed = function(knex, Promise) {
  return knex('list').del()
    .then(() => {
      return Promise.all([
        knex('list').insert({
          item: 'toothbrush', packed: false
        }, 'id'),
        knex('list').insert({
          item: 'potato', packed: true
        }, 'id')
      ])
    })
    .then(() => console.log('seed complete'))
    .catch(error => console.log(`error seeding data ${error}`))
};
