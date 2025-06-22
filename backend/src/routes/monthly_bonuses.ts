import { Request, Response, NextFunction, Router } from "express";
import {
  delete_monthly_bonuses,
  get_all_monthly_bonuses,
  get_all_monthly_bonuses_by_id,
  insert_monthly_bonuses,
  update_monthly_bonuses,
} from "../middleware/monthly_bonuses";
import { is_authorized_user_by_payload } from "../middleware/verification";
import { monthly_bonuses } from "../@types/types";

const router = Router();

router.get(
  "/monthly_bonuses",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const monthly_bonuses = await get_all_monthly_bonuses(
        user as Express.User,
      );

      res.status(200).json({
        message: "Successfully retreived user's monthly bonuses",
        data: monthly_bonuses,
      });
    } catch (error) {
      console.log(error);
      return next({ status: 500, error: "Error retrieving monthly bonuses" });
    }
  },
);
router.get(
  "/monthly_bonuses/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const monthly_bonuses_id = req.params.id;

      const monthly_bonuses = await get_all_monthly_bonuses_by_id(
        user as Express.User,
        monthly_bonuses_id,
      );

      if (!monthly_bonuses) {
        res.status(404).json({
          message:
            "Monthly bonuses not retrieved. No monthly bonuses with that id found for current user",
        });
        return;
      }

      res.status(200).json({
        message: "Successfully retrieved monthly bonus by id",
        data: monthly_bonuses,
      });
    } catch (error) {
      console.log(error);
      return next({
        status: 500,
        error: "Error retrieving monthly bonuses by id",
      });
    }
  },
);
router.post(
  "/monthly_bonuses",
  is_authorized_user_by_payload(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const payload = req.body as monthly_bonuses;

      const monthly_bonuses = await insert_monthly_bonuses(
        user as Express.User,
        payload,
      );

      res.status(200).json({
        message: "Successfully inserted monthly bonuses",
        data: monthly_bonuses,
      });
    } catch (error) {
      console.log(error);
      return next({ status: 500, error: "Error inserting monthly bonuses" });
    }
  },
);
router.put(
  "/monthly_bonuses",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const payload = req.body as monthly_bonuses;

      const monthly_bonuses = await update_monthly_bonuses(
        user as Express.User,
        payload,
      );

      if (!monthly_bonuses) {
        res.status(404).json({
          message:
            "Monthly bonuses not updated. No monthly bonuses with that id found for current user",
        });
        return;
      }

      res.status(200).json({
        message: "Successfully updated monthly bonuses",
        data: monthly_bonuses,
      });
    } catch (error) {
      console.log(error);
      return next({ status: 500, error: "Error updating monthly bonuses" });
    }
  },
);

router.delete(
  "/monthly_bonuses/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const monthly_bonuses_id = req.params.id;

      const monthly_bonuses = await delete_monthly_bonuses(
        user as Express.User,
        monthly_bonuses_id,
      );

      if ((monthly_bonuses.count = 0)) {
        res.status(404).json({
          message:
            "Monthly bonuses not deleted. No monthly bonuses with that id found for current user",
        });
        return;
      }

      res.status(200).json({ message: "Successfully deleted monthly bonuses" });
    } catch (error) {
      console.log(error);
      return next({ status: 500, error: "Error deleting monthly bonuses" });
    }
  },
);

export default router;
