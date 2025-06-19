import { sql } from "./db";

export async function dropTables(): Promise<void> {
  await sql`DROP TABLE IF EXISTS livingCosts;`;
  await sql`DROP TABLE IF EXISTS savingFunds;`;
  await sql`DROP TABLE IF EXISTS investments;`;
  await sql`DROP TABLE IF EXISTS guiltFreeSpendings;`;
  await sql`DROP TABLE IF EXISTS otherExpenses`;
  await sql`DROP TABLE IF EXISTS budgetAllocation;`;
  await sql`DROP TABLE IF EXISTS hashed_password`;
  await sql`DROP TABLE IF EXISTS users;`;
}
