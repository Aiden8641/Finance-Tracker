import { sql } from "../../postgreSQL/db";
import { budget_allocations } from "../../@types/types";

export async function get_budget_allocation_by_id(id: number | string) {
  const [budget_allocation]: [budget_allocations] = await sql`
    SELECT * from budgetAllocation
    WHERE id = ${id};
  `;

  return budget_allocation;
}
export async function get_budget_allocation_by_user_id(id: number | string) {
  const [budget_allocations]: [budget_allocations] = await sql`
    SELECT * from budgetAllocation
    WHERE user_id = ${id};
  `;

  return budget_allocations;
}

export async function updateBudgetAllocationRatios(
  new_budget_allocations: budget_allocations,
) {
  const [budget_allocations]: [budget_allocations] = await sql`
    UPDATE budgetAllocation
    SET
      savings_ratio = ${new_budget_allocations.percent_need},
      investments_ratio = ${new_budget_allocations.percent_wants},
      guilt_free_spending_ratio = ${new_budget_allocations.percent_savings}
    WHERE id = ${new_budget_allocations.id}
    RETURNING *;
  `;

  return budget_allocations;
}
