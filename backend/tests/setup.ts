import knex from "knex";
import { databaseConfig } from "../src/config";

export const db = knex(databaseConfig);

afterAll(async () => {
  await db.destroy(); // Close all database connections after tests
});
