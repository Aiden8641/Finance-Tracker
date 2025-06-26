import { Request, Response, NextFunction, Router } from "express";
import {
  get_financial_profiles_by_user_id,
  update_financial_profiles,
} from "../middleware/financial_profiles";
import { financial_profiles } from "../@types/types";

const router = Router();

router.get(
  "/financial_profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const financial_profile = await get_financial_profiles_by_user_id(
        user as Express.User,
      );

      res.status(200).json({
        message: "Successfully retrieved user's financial profile",
        data: financial_profile,
      });
    } catch (error) {
      console.log(error);
      return next({ status: 500, error: "Error retreiving financialprofile" });
    }
  },
);

router.put(
  "/financial_profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const user = req.user;
      const payload = req.body as financial_profiles;

      const financial_profile = await update_financial_profiles(
        user as Express.User,
        payload,
      );

      if (!financial_profile) {
        res.status(404).json({
          message:
            "Financial profile not updated. No financial profile with that id found for current user",
        });
        return;
      }

      res.status(200).json({
        message: "Financial profile Successfully updated",
        data: financial_profile,
      });
    } catch (error) {
      console.log(error);
      return next({ status: 500, error: "Error updating financial profile" });
    }
  },
);

export default router;
