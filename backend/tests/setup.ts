import knex from "knex";
import { databaseConfig } from "../src/config";

export const db = knex(databaseConfig);

/**
 * Function to clean up database connections
 */
export async function closeDatabaseConnections() {
  console.log("Closing database connections...");
  await db.destroy();
}

// Example usage in tests
(async () => {
  try {
    console.log("Running tests...");
    // Run your test logic here
  } finally {
    await closeDatabaseConnections(); // Ensure connections are closed after tests
  }
})();
