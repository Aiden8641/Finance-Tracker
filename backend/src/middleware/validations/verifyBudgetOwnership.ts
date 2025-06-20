import { Request, NextFunction, Response } from "express";
import {
  financial_profiles,
  monthly_bonuses,
  expenses,
  budget_allocations,
  goals,
  users,
} from "../../@types/types";

export function verify_user(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as users;

    if (payload.id != req.user?.id) {
      res.status(403).json({
        message: "User is not authorized to access this resource!",
      });
      return;
    }
    return next();
  } catch (error) {
    console.error(error);

    return next({ status: 500, error: "Error while verify payload!" });
  }
}

export function is_authorized_user(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.body as
      | financial_profiles
      | monthly_bonuses
      | expenses
      | budget_allocations
      | goals;

    if (payload.user_id != req.user?.id) {
      res.status(403).json({
        message: "User is not authorized to access this resource!",
      });
      return;
    }

    return next();
  } catch (error) {
    console.error(error);

    return next({ status: 500, error: "Error while verify payload!" });
  }
}
