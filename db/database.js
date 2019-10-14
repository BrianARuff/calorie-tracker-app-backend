const { Client } = require("pg");

const connectionString = "postgres://brian-ruff@localhost:5432/calorie_tracker";

const database = new Client({
  connectionString: connectionString || process.env.DATABASE_URL
});

database.connect();

module.exports = database;
