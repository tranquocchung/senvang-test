require("dotenv").config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "user_manager",
    host: process.env.POSTGRES_HOST || "127.0.0.1",
    port: process.env.POSTGRES_PORT || 5432,
    dialect: "postgres"
  },
  test: {
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB_TEST || "user_manager_test",
    host: process.env.POSTGRES_HOST || "127.0.0.1",
    port: process.env.POSTGRES_PORT || 5432,
    dialect: "postgres"
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    dialect: "postgres",

  }
};
