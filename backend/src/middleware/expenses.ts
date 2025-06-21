import { users, expenses } from "../@types/types";
import { sql } from "../postgreSQL/db";

export async function get_all_expenses_by_user_id(user: users) {
  const user_id = user.id;
  const expenses: expenses[] = await sql`
    SELECT * FROM otherExpenses 
    WHERE user_id = ${user_id};
  `;

  return expenses;
}

export async function get_expense_by_id(
  user: Express.User,
  id: number | string,
) {
  const user_id = user.id;
  const [expense]: [expenses] = await sql`
    SELECT * FROM expenses
    WHERE id = ${id} and user_id = ${user_id}
  `;

  return expense;
}

export async function insert_expenses(expense: expenses) {
  const [insertedExpense]: [expenses] = await sql`
    INSERT INTO otherExpenses (budget_id, category, label, expense_amount)
    VALUES (${expense.user_id},${expense.category_id}, ${expense.description}, ${expense.expense_amount})
    RETURNING *;
  `;

  return insertedExpense;
}

export async function update_expenses(user: Express.User, expense: expenses) {
  const user_id = user.id;

  const [updatedExpense]: [expenses] = await sql`
    UPDATE expenses SET
      category_id = ${expense.category_id},
      description = ${expense.description},
      expense_amount = ${expense.expense_amount}, 
    WHERE id = ${expense.id} and user_id = ${user_id} 
    RETURNING *;
  `;

  return updatedExpense;
}

export async function delete_expenses(user: Express.User, id: number | string) {
  const user_id = user.id;
  const expense = await sql`
    DELETE FROM otherExpenses WHERE id = ${id} and user_id = ${user_id} RETURNING *;
  `;

  return expense;
}
