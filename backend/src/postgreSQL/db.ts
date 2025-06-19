import postgres from "postgres";
import { configDotenv } from "dotenv";
import {
  createUserTable,
  createBudgetAllocationTable,
  createLivingCostsTable,
  createSavingFunds,
  createInvestmentsTable,
  createGuiltFreeSpendingTable,
  createExpensesTable,
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
    await createUserTable();
    await createBudgetAllocationTable();
    await createLivingCostsTable();
    await createSavingFunds();
    await createInvestmentsTable();
    await createGuiltFreeSpendingTable();
    await createExpensesTable();

    // await updateBudgetSql();
    // await updateBudgetOnUserChange();
  } catch (error) {
    console.log("Error creating tables", error);
  }
}
