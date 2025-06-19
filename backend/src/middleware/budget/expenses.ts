import { sql } from "../../postgreSQL/db";
import { expenses } from "../../@types/user";

export async function getAllExpenseByBudgetId(budget_id: number | string) {
  const expenses: expenses[] = await sql`
    SELECT * FROM otherExpenses 
    WHERE budget_id = ${budget_id};
  `;

  return expenses;
}

export async function insertExpense(expense: expenses) {
  const [insertedExpense]: [expenses] = await sql`
    INSERT INTO otherExpenses (budget_id, category, label, expense_amount)
    VALUES (${expense.budget_id},${expense.category}, ${expense.label}, ${expense.expense_amount})
    RETURNING *;
  `;

  return insertedExpense;
}

export async function updateExpense(expense: expenses) {
  const [updatedExpense]: [expenses] = await sql`
    UPDATE otherExpenses SET
      category = COALESCE(${expense.category}, category),
      label = COALESCE(${expense.label}, label),
      expense_amount = COALESCE(${expense.expense_amount}, expense_amount)
    WHERE id = ${expense.id}
    RETURNING *;
  `;

  return updatedExpense;
}

export async function deleteExpense(expenseId: number | string) {
  await sql`
    DELETE FROM otherExpenses WHERE id = ${expenseId};
  `;

  return;
}
