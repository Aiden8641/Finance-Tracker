import { Request, NextFunction, Response } from "express";
import {
  financial_profiles,
  monthly_bonuses,
  expenses,
  budget_allocations,
  goals,
  users,
} from "../../@types/types";
import { Tables } from "../../enums/enums";
import { sql } from "../../postgreSQL/db";

export function verify_user(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as users;

    console.log(payload.id);
    console.log(req.user?.id);
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

// mainly using for INSERT requests
// other requests will have the sql WHERE clause allowing only modification where user_id and id of the payload match a users resource
// can still be used on most routes for a quick check
// allows for less sql queries, faster response time
export function is_authorized_user_by_payload() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = req.body as
        | financial_profiles
        | monthly_bonuses
        | expenses
        | budget_allocations
        | goals;

      // this check is not really necessary if the other check is being used but can still be used as an extra
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
  };
}

export function is_authorized_user_by_params(table: Tables) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let param_id = parseInt(req.params.id);

      // can ignore tyescript warning of user being undefined as the routes require authentication to access meaning req.user will be populated
      const is_authorized_user =
        await sql`SELECT * FROM ${table} WHERE id = ${param_id} and user_id = ${req.user!.id} `;

      if (!is_authorized_user) {
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
  };
}
