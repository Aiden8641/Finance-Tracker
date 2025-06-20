import { sql } from "./db";

export async function users(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
      email TEXT NOT NULL, 
      username TEXT NOT NULL,
      hashed_password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;
}

export async function financial_profiles() {
  await sql`
    CREATE TABLE IF NOT EXISTS financial_profiles (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
      income INTEGER NOT NULL, 
      dividends_and_other_income INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function monthly_bonuses() {
  await sql`
    CREATE TABLE IF NOT EXISTS monthly_bonuses (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
      description TEXT, 
      expense_amount INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function budget_monthly_snapshots() {
  await sql`
    CREATE TABLE IF NOT EXISTS budget_monthly_snapshots (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
      income INTEGER NOT NULL, 
      total_expenses INTEGER NOT NULL,
      percent_needs INTEGER NOT NULL, 
      percent_wants INTEGER NOT NULL, 
      percent_savings INTEGER NOT NULL, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function budget_allocations(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS budget_allocations (  
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
      percent_needs INTEGER NOT NULL DEFAULT 50, 
      percent_wants INTEGER NOT NULL DEFAULT 30, 
      percent_savings INTEGER NOT NULL DEFAULT 20, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      CHECK (percent_needs + percent_wants + percent_savings <= 100)
    )
`;
}

export async function expenses(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users (id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES categories (id),
      description TEXT NOT NULL,
      expense_amount NUMERIC NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;
}

export async function goals() {
  await sql`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function categories() {
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      category_name TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}
