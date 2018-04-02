// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/mars_pack',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }

};
