const dotenv = require('dotenv');
dotenv.config();

const databaseConfig = {
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: false,
  },
  migrations: {
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
  pool: {
    min: 2, // Minimum number of connections
    max: 10, // Maximum number of connections
  },
};

module.exports = { databaseConfig };
