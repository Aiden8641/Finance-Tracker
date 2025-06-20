import { Router } from "express";
import { createUpdateHandler } from "../middleware/updateHandler";
import { verifyUserPayload } from "../middleware/user";
import { updateUser } from "../middleware/user";
import { usersResponse } from "../@types/types";

const router = Router();

router.get("/user", async (req, res, next) => {
  try {
    const user = req.user as usersResponse;

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

router.get("/goals");
router.get("/goals/:id");
router.post("/goals");
router.put("/goals");
router.delete("/goals");

export default router;
