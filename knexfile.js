module.exports = {

  development: {
    client: "pg",
    connection: {
      database: "first_quiz"
    },
    migrations: {
      directory: "./db/migrations"
    }
  }
};