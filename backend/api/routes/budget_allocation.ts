import { Request, Response, NextFunction, Router } from "express";
import { budget_allocations } from "../@types/types";
import {
  get_budget_allocation_by_user_id,
  update_budget_allocation,
} from "../middleware/budget_allocations";

const router = Router();

router.get(
  "/budget_allocation",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const budget_allocation = await get_budget_allocation_by_user_id(
        user as Express.User,
      );

      res.status(200).json({
        message: "Succesfully retrieved users budget_allocation",
        data: budget_allocation,
      });
    } catch (error) {
      console.log(error);
      return next({ status: 500, error: "Error getting budget allocation" });
    }
  },
);

router.put(
  "/budget_allocation",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const payload = req.body as budget_allocations;

      const budget_allocation = await update_budget_allocation(
        user as Express.User,
        payload,
      );

      if (!budget_allocation) {
        res.status(404).json({
          message:
            "Budget allocation not updated. No budget allocation with that id found for current user",
        });
        return;
      }

      res.status(200).json({
        message: "Budget allocation Succesfully retrieved",
        data: budget_allocation,
      });
    } catch (error) {
      console.log(error);
      return next({
        status: 500,
        error: "Error updating users budget allocation",
      });
    }
  },
);

export default router;
