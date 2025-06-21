import { budget_allocations, users } from "../@types/types";
import { sql } from "../postgreSQL/db";

export async function get_budget_allocation_by_id(id: number | string) {
  const [budget_allocation]: [budget_allocations] = await sql`
    SELECT * from budgetAllocation
    WHERE id = ${id};
  `;

  return budget_allocation;
}

export async function get_budget_allocation_by_user_id(user: users) {
  const user_id = user.id;
  const [budget_allocations]: [budget_allocations] = await sql`
    SELECT * from budgetAllocation
    WHERE user_id = ${user_id};
  `;

  return budget_allocations;
}

export async function updateBudgetAllocationRatios(
  new_budget_allocations: budget_allocations,
) {
  const [budget_allocations]: [budget_allocations] = await sql`
    UPDATE budgetAllocation
    SET
      percent_need = ${new_budget_allocations.percent_need},
      percent_wants = ${new_budget_allocations.percent_wants},
      percent_savings = ${new_budget_allocations.percent_savings}
    WHERE id = ${new_budget_allocations.id}
    RETURNING *;
  `;

  return budget_allocations;
}
