import { NextFunction, Request, Response, Router } from "express";
import { users } from "../@types/types";
import { updateUser } from "../middleware/user";
import { verify_user } from "../middleware/verification";

const router = Router();

router.get("/user", async (req, res, next) => {
  try {
    const user = req.user as users;

    res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/user",
  verify_user,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as users;

      const updated_user = await updateUser(payload);

      res.status(200).json({
        message: "Successfully updated user!",
        data: updated_user,
      });
    } catch (error) {
      return next({ status: 500, error: "Error updating user!" });
    }
  },
);
export default router;
