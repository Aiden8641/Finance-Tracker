import { budget_allocations } from "../@types/types";
import { sql } from "../postgreSQL/db";

export async function get_budget_allocation_by_id(
  user: Express.User,
  id: number | string,
) {
  const user_id = user.id;

  const [budget_allocation]: [budget_allocations] = await sql`
    SELECT * from budgetAllocation
    WHERE id = ${id} and user_id = ${user_id};
  `;

  return budget_allocation;
}

export async function get_budget_allocation_by_user_id(user: Express.User) {
  const user_id = user.id;
  const [budget_allocations]: [budget_allocations] = await sql`
    SELECT * from budgetAllocation
    WHERE user_id = ${user_id};
  `;

  return budget_allocations;
}

export async function update_budget_allocation(
  user: Express.User,
  new_budget_allocations: budget_allocations,
) {
  const user_id = user.id;

  const [budget_allocations]: [budget_allocations] = await sql`
    UPDATE budgetAllocation
    SET
      percent_need = ${new_budget_allocations.percent_need},
      percent_wants = ${new_budget_allocations.percent_wants},
      percent_savings = ${new_budget_allocations.percent_savings}
    WHERE id = ${new_budget_allocations.id} and user_id = ${user_id}
    RETURNING *;
  `;

  return budget_allocations;
}
