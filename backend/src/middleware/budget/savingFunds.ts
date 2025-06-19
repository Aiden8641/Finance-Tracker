import { sql } from "../../postgreSQL/db";
import { savingFundsRatio, savingsFundsResponse } from "../../@types/user";

export async function getSavingFundsById(id: number | string) {
  const [savingFunds]: [savingsFundsResponse] = await sql`
    SELECT * FROM savingFunds 
    WHERE id = ${id};
  `;

  return savingFunds;
}

export async function getSavingFundsByBudgetId(id: number | string) {
  const [savingFunds]: [savingsFundsResponse] = await sql`
    SELECT * FROM savingFunds 
    WHERE budget_id = ${id};
  `;

  return savingFunds;
}

export async function updateSavingFundsRatio(funds: savingFundsRatio) {
  const [updateFundsRatio]: [savingsFundsResponse] = await sql`
      UPDATE savingFunds SET
        emergency_fund_ratio = ${funds.emergency_fund_ratio},
        vacation_fund_ratio = ${funds.vacation_fund_ratio},
        gifts_fund_ratio = ${funds.gifts_fund_ratio}
      WHERE id = ${funds.id}
      RETURNING *;
    `;

  return updateFundsRatio;
}

// export async function updateSavingFunds(fundsAmount: number) {
//   const [updateFundsAmount]: [savingsFundsResponse] = await sql`
//     UPDATE savingFunds SET
//       emergency_funds = ${fundsAmount * savingFunds.emergency_fund_ratio},
//   `;
// }
