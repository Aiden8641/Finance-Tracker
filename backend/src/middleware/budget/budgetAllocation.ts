import { budgetAllocation, budgetCategories, user } from "../../@types/user";
import { Categories } from "../../enums/enums";
import { sql } from "../../postgreSQL/db";

export async function getBudgetAllocationById(id: number | string) {
  const [budgetAllocation]: [budgetAllocation] = await sql`
    SELECT * from budgetAllocation
    WHERE id = ${id};
  `;

  return budgetAllocation;
}
export async function getBudgetAllocationByUserId(id: number | string) {
  const [budgetAllocation]: [budgetAllocation] = await sql`
    SELECT * from budgetAllocation
    WHERE user_id = ${id};
  `;

  return budgetAllocation;
}

export async function updateBudgetAllocationRatios(
  user: Express.User,
  budgetAllocation: budgetAllocation,
) {
  const [updatedBudgetAllocation]: [budgetAllocation] = await sql`
    UPDATE budgetAllocation
    SET
      savings_ratio = ${budgetAllocation.savings_ratio},
      investments_ratio = ${budgetAllocation.investments_ratio},
      guilt_free_spending_ratio = ${budgetAllocation.guilt_free_spending_ratio}
    WHERE id = ${user.id}
    RETURNING *;
  `;

  return updatedBudgetAllocation;
}

export async function getAvailableBudgetForCategory(
  user: user,
  budgetAllocation: budgetAllocation,
  category?: budgetCategories,
) {
  const availableIncome = user.availabe_income;

  const ratioMap: Record<budgetCategories, number> = {
    [Categories.SavingsFunds]: budgetAllocation.savings_ratio,
    [Categories.Investments]: budgetAllocation.investments_ratio,
    [Categories.GuiltFreeSpendings]: budgetAllocation.guilt_free_spending_ratio,
  };

  if (category) {
    return availableIncome * ratioMap[category];
  }

  return Object.fromEntries(
    Object.entries(ratioMap).map((val) => [val[0], availableIncome * val[1]]),
  );
}
