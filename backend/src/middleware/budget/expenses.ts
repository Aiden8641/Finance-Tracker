import { sql } from "../../postgreSQL/db";
import { expenses } from "../../@types/types";

export async function get_all_expenses_by_user_id(id: number | string) {
  const expenses: expenses[] = await sql`
    SELECT * FROM otherExpenses 
    WHERE user_id = ${id};
  `;

  return expenses;
}

export async function insert_expenses(expense: expenses) {
  const [insertedExpense]: [expenses] = await sql`
    INSERT INTO otherExpenses (budget_id, category, label, expense_amount)
    VALUES (${expense.user_id},${expense.category_id}, ${expense.description}, ${expense.expense_amount})
    RETURNING *;
  `;

  return insertedExpense;
}

export async function update_expenses(expense: expenses) {
  const [updatedExpense]: [expenses] = await sql`
    UPDATE expenses SET
      category_id = ${expense.category_id},
      description = ${expense.description},
      expense_amount = ${expense.expense_amount}, 
    WHERE id = ${expense.id}
    RETURNING *;
  `;

  return updatedExpense;
}

export async function delete_expenses(id: number | string) {
  await sql`
    DELETE FROM otherExpenses WHERE id = ${id};
  `;

  return;
}
