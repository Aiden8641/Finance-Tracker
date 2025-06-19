import { Router } from "express";
import { createUpdateHandler } from "../middleware/updateHandler";
import { verifyUserPayload } from "../middleware/user";
import { updateUser } from "../middleware/user";
import { userResponse } from "../@types/user";

const router = Router();

router.get("/user", async (req, res, next) => {
  try {
    const user = req.user as userResponse;

    res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/user",
  verifyUserPayload,
  createUpdateHandler("userUpdate", updateUser),
);

export default router;
