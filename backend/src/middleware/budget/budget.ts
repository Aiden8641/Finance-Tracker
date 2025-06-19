import { user } from "../../@types/user";
import { getBudgetAllocationByUserId } from "./budgetAllocation";
import { getGuiltFreeSpendingByBudgetId } from "./guiltFreeSpending";
import { getInvestmenstsByBudgetId } from "./investments";
import { getSavingFundsByBudgetId } from "./savingFunds";

export async function getUsersBudget(user: user) {
  const budgetAllocation = await getBudgetAllocationByUserId(
    user?.id as number,
  );

  const budgetId = budgetAllocation.id;

  const savingFunds = await getSavingFundsByBudgetId(budgetId);
  const investments = await getInvestmenstsByBudgetId(budgetId);
  const guiltFreeSpending = await getGuiltFreeSpendingByBudgetId(budgetId);

  return {
    budgetAllocation: budgetAllocation,
    savingFunds: savingFunds,
    investments: investments,
    guiltFreeSpending: guiltFreeSpending,
  };
}
