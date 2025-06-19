import { sql } from "./db";

export async function createUserTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
      username TEXT NOT NULL,
      hashed_password TEXT NOT NULL,
      non_liquid_assets NUMERIC DEFAULT 0,
      liquid_assets NUMERIC DEFAULT 0,
      savings NUMERIC DEFAULT 0,
      checking NUMERIC DEFAULT 0,
      debt NUMERIC DEFAULT 0,
      monthly_income NUMERIC DEFAULT 0,
      other_income NUMERIC DEFAULT 0,
      bonuses NUMERIC DEFAULT 0,
      available_income NUMERIC DEFAULT 0
    )
`;
}

// export async function createHashedPasswordTable(): Promise<void> {
//   await sql`
//     CREATE TABLE IF NOT EXISTS hashed_password (
//       id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//       user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
//     )
//   `;
// }

export async function createBudgetAllocationTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS budgetAllocation (  
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
      savings_ratio NUMERIC NOT NULL DEFAULT 0.40,
      investments_ratio NUMERIC NOT NULL DEFAULT 0.40,
      guilt_free_spending_ratio NUMERIC NOT NULL DEFAULT 0.20,
      CHECK (savings_ratio + investments_ratio + guilt_free_spending_ratio <= 1)
    )
`;
}
export async function createLivingCostsTable(): Promise<void> {
  await sql`
  CREATE TABLE IF NOT EXISTS livingCosts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    budget_id INTEGER UNIQUE REFERENCES budgetAllocation (id) ON DELETE CASCADE, 
    rent NUMERIC DEFAULT 0,
    bills NUMERIC DEFAULT 0,
    insurance NUMERIC DEFAULT 0, 
    transportation NUMERIC DEFAULT 0, 
    debt_payments NUMERIC DEFAULT 0, 
    groceries NUMERIC DEFAULT 0,
    buffer_percent NUMERIC DEFAULT 0.05,
    buffer_amount NUMERIC GENERATED ALWAYS AS (
      ROUND(
        (rent + bills + insurance + transportation + debt_payments + groceries) * buffer_percent,
        2
      )
    ) STORED
  )
`;
}

export async function createSavingFunds(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS savingFunds (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      budget_id INTEGER UNIQUE REFERENCES budgetAllocation (id) ON DELETE CASCADE, 
      saving_funds_amount NUMERIC DEFAULT 0, 
      emergency_fund_ratio NUMERIC NOT NULL DEFAULT 0.50, 
      vacation_fund_ratio NUMERIC NOT NULL DEFAULT 0.30,
      gifts_fund_ratio NUMERIC NOT NULL DEFAULT 0.20, 
      emergency_funds NUMERIC DEFAULT 0,
      vacation_funds NUMERIC DEFAULT 0,
      gifts_funds NUMERIC DEFAULT 0,
      CHECK (emergency_fund_ratio + vacation_fund_ratio + gifts_fund_ratio <= 1)
    )
`;
}

export async function createInvestmentsTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS investments (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      budget_id INTEGER UNIQUE REFERENCES budgetAllocation (id) ON DELETE CASCADE, 
      investments_amount NUMERIC DEFAULT 0,
      retirement_savings_ratio NUMERIC NOT NULL DEFAULT 0.30,
      stocks_ratio NUMERIC NOT NULL DEFAULT 0.50,
      bonds_ratio NUMERIC NOT NULL DEFAULT 0.20,
      retirement_savings NUMERIC DEFAULT 0,
      stocks NUMERIC DEFAULT 0,
      bonds NUMERIC DEFAULT 0,
      CHECK (retirement_savings_ratio + stocks_ratio + bonds_ratio <= 1)
    )
`;
}

export async function createGuiltFreeSpendingTable(): Promise<void> {
  await sql` 
    CREATE TABLE IF NOT EXISTS guiltFreeSpendings (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      budget_id INTEGER UNIQUE REFERENCES budgetAllocation (id) ON DELETE CASCADE, 
      available_guilt_free_spending NUMERIC DEFAULT 0
    )
`;
}

export async function createExpensesTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS otherExpenses (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      budget_id INTEGER UNIQUE REFERENCES budgetAllocation (id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      label TEXT NOT NULL,
      expense_amount NUMERIC NOT NULL
    )
`;
}
