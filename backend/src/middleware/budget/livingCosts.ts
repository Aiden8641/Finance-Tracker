import { sql } from "../../postgreSQL/db";
import { livingCosts, livingCostsResponse } from "../../@types/user";

export async function getLivingCostsByBudgetId(budgetId: number) {
  const [livingCosts] = await sql`
    SELECT * FROM livingCosts
    WHERE user_id = ${budgetId};
  `;

  return { livingCosts: livingCosts };
}

export async function getLivingCostsById(id: number | string) {
  const [livingCosts]: [livingCostsResponse] = await sql`
    SELECT * FROM livingCosts
    WHERE id = ${id};
  `;

  return livingCosts;
}

export async function updateLivingCosts(livingCosts: livingCosts) {
  const [updateLivingCosts]: [livingCostsResponse] = await sql`
    UPDATE livingCosts
    SET
      rent = ${livingCosts.rent},
      bills = ${livingCosts.bills},
      insurance = ${livingCosts.insurance},
      transportation = ${livingCosts.transportation},
      debt_payments = ${livingCosts.debt_payments},
      groceries = ${livingCosts.groceries},
      buffer_percent = ${livingCosts.buffer_percent}
    WHERE id = ${livingCosts.id}
    RETURNING *;
  `;

  return { livingCosts: updateLivingCosts };
}
