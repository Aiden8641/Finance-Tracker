import postgres from "postgres";
import { configDotenv } from "dotenv";
import {
  users,
  financial_profiles,
  monthly_bonuses,
  expenses,
  categories,
  budget_allocations,
  budget_monthly_snapshots,
  goals,
} from "./tables";
import { types } from "pg";

configDotenv();

const connnectionString = process.env.DATABASE_URL as string;

export const sql = postgres(connnectionString, {
  types: {
    numeric: {
      to: types.builtins.NUMERIC,
      from: [types.builtins.NUMERIC],
      serialize: (val: number) => val.toString(),
      parse: (val: string) => parseFloat(val),
    },
  },
});

export async function checkDBConnection(): Promise<void> {
  try {
    const select = await sql`SELECT * FROM users WHERE username = 'fred'`;
    console.log(select[0]);
    await sql`SELECT 1`;

    console.log("Successfully connected to DB");
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
}

export async function setupDB(): Promise<void> {
  try {
    await users();
    await financial_profiles();
    await monthly_bonuses();
    await categories();
    await expenses();
    await budget_allocations();
    await budget_monthly_snapshots();
    await goals();

    console.log("DB Successfully created!");
  } catch (error) {
    console.log("Error creating tables", error);
  }
}

export async function dropTables(): Promise<void> {
  await sql`DROP TABLE IF EXISTS financial_profiles`;
  await sql`DROP TABLE IF EXISTS monthly_bonuses`;
  await sql`DROP TABLE IF EXISTS expenses`;
  await sql`DROP TABLE IF EXISTS categories`;
  await sql`DROP TABLE IF EXISTS budget_allocations`;
  await sql`DROP TABLE IF EXISTS budget_monthly_snapshots`;
  await sql`DROP TABLE IF EXISTS goals`;
  await sql`DROP TABLE IF EXISTS users`;
}
