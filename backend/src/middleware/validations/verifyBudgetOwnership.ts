import { NextFunction, Response } from "express";
import { financialRequest } from "../../@types/request";
import { Categories, requestTypes } from "../../enums/enums";
import { sql } from "../../postgreSQL/db";
import { getBudgetAllocationByUserId } from "../budget/budgetAllocation";

export async function isOwnedByUser(
  user: Express.User,
  itemId: number,
  category:
    | Categories.LivingCosts
    | Categories.SavingsFunds
    | Categories.Investments
    | Categories.GuiltFreeSpendings
    | Categories.Expenses,
) {
  const userId = user.id;

  const { id: budget_id } = await getBudgetAllocationByUserId(userId);

  console.log(category);
  console.log(itemId);
  console.log(budget_id);

  const [isOwnedByUser] = await sql`
      SELECT * FROM ${sql(category.toLocaleLowerCase())} 
      WHERE id = ${itemId} and budget_id = ${budget_id};
  `;

  if (!isOwnedByUser) {
    return false;
  }

  return true;
}

export function createOwnershipVerification(
  key: requestTypes,
  category:
    | Categories.LivingCosts
    | Categories.SavingsFunds
    | Categories.Investments
    | Categories.GuiltFreeSpendings
    | Categories.Expenses,
) {
  return async (req: financialRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.body[key]) {
        return next(new Error("update body missing!"));
      }
      const itemId = req.body[key].id;

      const isOwned = await isOwnedByUser(
        req.user as Express.User,
        itemId,
        category,
      );
      if (!isOwned) {
        res.json("User not authorized to access item!");
        return;
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
