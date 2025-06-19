import { sql } from "../../postgreSQL/db";
import { guiltFreeSpending } from "../../@types/user";

export async function getGuiltFreeSpendingById(id: number | string) {
  const [guiltFreeSpending]: [guiltFreeSpending] = await sql`
    SELECT * FROM guiltFreeSpending
    WHERE id = ${id};
  `;

  return guiltFreeSpending;
}

export async function getGuiltFreeSpendingByBudgetId(id: number | string) {
  const [guiltFreeSpending]: [guiltFreeSpending] = await sql`
    SELECT * FROM guiltFreeSpendings
    WHERE budget_id = ${id};
  `;

  return guiltFreeSpending;
}

export async function updateGuiltFreeSpending(
  guiltFreeSpending: guiltFreeSpending,
) {
  const [updatedGuiltFreeSpending]: [guiltFreeSpending] = await sql`
    UPDATE guiltFreeSpendings SET
      guilt_free_spending_total = ${guiltFreeSpending.guilt_free_spending_total}
    WHERE id = ${guiltFreeSpending.id}
    RETURNING *;
  `;

  return updatedGuiltFreeSpending;
}
