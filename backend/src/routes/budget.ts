// TODO: setup routes
import { Router } from "express";
import { financialRequest } from "../@types/request";
import { Categories, requestTypes } from "../enums/enums";
import { getUsersBudget } from "../middleware/budget/budget";
import {
  getBudgetAllocationByUserId,
  updateBudgetAllocationRatios,
} from "../middleware/budget/budgetAllocation";
import {
  deleteExpense,
  getAllExpenseByBudgetId,
  insertExpense,
} from "../middleware/budget/expenses";
import { updateInvestmentsRatio } from "../middleware/budget/investments";
import { updateLivingCosts } from "../middleware/budget/livingCosts";
import { updateSavingFundsRatio } from "../middleware/budget/savingFunds";
import { createUpdateHandler } from "../middleware/updateHandler";
import { createOwnershipVerification } from "../middleware/validations/verifyBudgetOwnership";

const router = Router();

router.get("/budget", async (req, res, next) => {
  try {
    const user = req.user;

    const budget = await getUsersBudget(user as Express.User);

    res.json(budget);
  } catch (error) {
    return next(error);
  }
});

// router.get(
//   "/budget/:budget_id/budgetAllocation/:allocation_id",
//   async (req, res, next) => {
//     const id = req.params.budget_id;
//     const budgetAllocation = await getBudgetAllocationById(parseFloat(id));
//
//     res.json(budgetAllocation);
//   },
// );

router.put(
  "/budget/budgetAllocation",
  async (req: financialRequest, res, next) => {
    try {
      if (!req.user || !req.body.budgetAllocationUpdate) {
        res.json("Unauthorized access or missing payload! ");
        return;
      }

      console.log(req.body.budgetAllocationUpdate);
      const budgetAllocation = await updateBudgetAllocationRatios(
        req.user,
        req.body.budgetAllocationUpdate,
      );

      res.json(budgetAllocation);
    } catch (error) {
      return next(error);
    }
  },
);

router.put(
  "/budget/livingCosts",
  createOwnershipVerification(requestTypes.LivingCosts, Categories.LivingCosts),
  createUpdateHandler(requestTypes.LivingCosts, updateLivingCosts),
);

router.put(
  "/budget/savingFunds",
  createOwnershipVerification(
    requestTypes.SavingsFunds,
    Categories.SavingsFunds,
  ),
  createUpdateHandler(requestTypes.SavingsFunds, updateSavingFundsRatio),
);

router.put(
  "/budget/investments",
  createOwnershipVerification(requestTypes.Investments, Categories.Investments),
  createUpdateHandler(requestTypes.Investments, updateInvestmentsRatio),
);

router.get("/budget/expenses", async (req, res, next) => {
  try {
    const { id: budget_id } = await getBudgetAllocationByUserId(
      req.user?.id as number,
    );

    const expense = await getAllExpenseByBudgetId(budget_id);

    res.json(expense);
  } catch (error) {
    return next(error);
  }
});

router.post("/budget/expenses", async (req: financialRequest, res, next) => {
  try {
    const expensePayload = req.body.expenses;
    const { id: budget_id } = await getBudgetAllocationByUserId(
      req.user?.id as number,
    );

    if (!expensePayload) {
      return next(new Error("Expense payload missing"));
    }

    if (expensePayload.budget_id != budget_id) {
      res.json("User is not authorized to perform this action!");
      return;
    }

    const expense = await insertExpense(expensePayload);

    res.json(expense);
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/budget/expenses",
  createOwnershipVerification(requestTypes.Expenses, Categories.Expenses),
  async (req: financialRequest, res, next) => {
    try {
      const expensePayload = req.body.expenses;

      if (!expensePayload) {
        return next(new Error("Expense payload missing!"));
      }

      const expense = await insertExpense(expensePayload);

      res.json(expense);
    } catch (error) {
      return next(error);
    }
  },
);

router.delete("/budget/expenses/:expense_id", async (req, res, next) => {
  try {
    const expenseId = req.params.expense_id;

    await deleteExpense(expenseId);

    res.json("Expense has been deleted!");
  } catch (error) {
    return next(error);
  }
});

export default router;
