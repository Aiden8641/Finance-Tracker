// TODO: setup routes
import { Request, NextFunction, Router, Response } from "express";
import {
  delete_expenses,
  get_all_expenses_by_user_id,
  get_expense_by_id,
  insert_expenses,
  update_expenses,
} from "../middleware/expenses";
import { is_authorized_user_by_payload } from "../middleware/verification";
import { expenses } from "../@types/types";

const router = Router();

router.get("/financial_profile");
router.put("/financial_profile");

router.get("/monthly_bonuses");
router.get("/monthly_bonuses/:id");
router.post("/monthly_bonuses");
router.put("/monthly_bonuses");
router.delete("/monthly_bonuses");

router.get("/budget_allocation");
router.put("/budget_allocation");

router.get(
  "/expenses",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const expenses = await get_all_expenses_by_user_id(user as Express.User);

      res
        .status(200)
        .json({ message: "Retreived all of users expenses!", data: expenses });
    } catch (error) {
      console.log(error);
      return next({
        status: 500,
        error: "Error retrieving all of users expenses!",
      });
    }
  },
);

router.get(
  "/expenses/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const expense_id = req.params.id;

      const expenses = await get_expense_by_id(
        user as Express.User,
        expense_id,
      );

      if (!expenses) {
        res.status(404).json({
          message:
            "Expense not retrieved. No expense with that id for current user",
        });
        return;
      }
      res.status(200).json({ message: "Expense retrieved", data: expenses });
    } catch (error) {
      console.log(error);
      return next({ status: 500, error: "Error retreiving expense by id" });
    }
  },
);

router.post(
  "/expenses",
  is_authorized_user_by_payload(),
  async (req, res, next) => {
    try {
      const payload = req.body as expenses;

      const expenses = await insert_expenses(payload);

      res.status(200).json({
        message: "Succesfully added expense to current user!",
        data: expenses,
      });
    } catch (error) {
      console.log(error);
      return next({
        status: 500,
        error: "Error inserting expense for current user!",
      });
    }
  },
);

router.put(
  "/expenses",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const payload = req.body as expenses;

      const expenses = await update_expenses(user as Express.User, payload);

      if (!expenses) {
        res.status(404).json({
          message:
            "Expense not updated. No expense with that id for current user",
        });
        return;
      }

      res.status(200).json({ message: "Expense updated", data: expenses });
    } catch (error) {
      console.log(error);
      return next({ status: 500, error: "Error updating expense" });
    }
  },
);

router.delete("/expenses/:id", async (req, res, next) => {
  try {
    const user = req.user;
    const expense_id = req.params.id;

    const expenses = await delete_expenses(user as Express.User, expense_id);

    if ((expenses.length = 0)) {
      res.status(404).json({
        message:
          "Expense not deleted. No expense with that id for current user",
      });
      return;
    }

    res.status(200).json({ message: "Expense Succesfully deleted" });
  } catch (error) {
    console.log(error);
    return next({ status: 500, error: "Error deleting expenses" });
  }
});

export default router;
