import { NextFunction, Request, Response, Router } from "express";
import { users } from "../@types/types";
import { updateUser } from "../middleware/user";
import { verify_user } from "../middleware/validations/verifyBudgetOwnership";

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
    const payload = req.body as users;

    const updated_user = await updateUser(payload);

    res
      .status(200)
      .json({ message: "Successfully updated user!", user_data: updated_user });
  },
);

router.get("/goals");
router.get("/goals/:id");
router.post("/goals");
router.put("/goals");
router.delete("/goals");

export default router;
