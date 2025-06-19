import { sql } from "./db";

export async function updateBudgetOnUserChange(): Promise<void> {
  await sql`
    DROP TRIGGER IF EXISTS userUpdate ON users;
  `;

  await sql`
    CREATE TRIGGER userUpdate 
      AFTER UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION updateBudget();
`;
}

export async function updateBudgetSql() {
  await sql`
    CREATE OR REPLACE FUNCTION updateBudget()
    RETURNS TRIGGER AS $$
    DECLARE 
      curr_budget_id INTEGER;
      curr_savings_ratio NUMERIC;
      curr_investments_ratio NUMERIC;
      curr_guilt_free_spending_ratio NUMERIC; 
    BEGIN 
      SELECT id, savings_ratio, investments_ratio, guilt_free_spending_ratio
      FROM budgetAllocatioINTO curr_budget_id, curr_savings_ratio, curr_investments_ratio, curr_guilt_free_spending_ration
      WHERE user_id = NEW.id;

      UPDATE savingFunds
      SET 

      UPDATE guiltFreeSpendings
      SET available_guilt_free_spending =
        COALESCE(NEW.available_income * curr_guilt_free_spending_ratio, 0)
      WHERE budget_id = curr_budget_id;

      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
  `;
}
