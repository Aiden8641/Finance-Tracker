import { sql } from "../../postgreSQL/db";
import { investmentsRatio, investmentsResponse } from "../../@types/user";

export async function getInvestmenstsById(id: number | string) {
  const [investments]: [investmentsResponse] = await sql`
    SELECT * FROM investments
    WHERE id = ${id};
  `;

  return investments;
}

export async function getInvestmenstsByBudgetId(id: number | string) {
  const [investments]: [investmentsResponse] = await sql`
    SELECT * FROM investments
    WHERE budget_id = ${id};
  `;

  return investments;
}

export async function updateInvestmentsRatio(investments: investmentsRatio) {
  const [updatedInvestments]: [investmentsResponse] = await sql`
    UPDATE investments SET 
      retirement_savings_ratio = ${investments.retirement_savings_ratio},
      stocks_ratio = ${investments.stocks_ratio},
      bonds_ratio = ${investments.bonds_ratio}
    WHERE id = ${investments.id}
    RETURNING *;
  `;

  return updatedInvestments;
}

//TODO:need to update the amount for the different types of investments when ratio changes
//
// export async function updateInvestmentAmountsByUserId() {
//   const availableIncome = await getAvailableIncomeByUserId(userId);

// const [updatedInvestments]: [investmentsResponse] = await sql`
//   UPDATE investments SET
//    retirement_savings = ${investments.retirement_savings_ratio *
//
// `;
// }
