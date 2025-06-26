import { Router } from "express";
import { get_snapshots } from "../middleware/monthy_snapshots";

const router = Router();

router.get("/monthly_snapshots", async (req, res, next) => {
  try {
    const user = req.user;

    const snapshot = await get_snapshots(user as Express.User);

    res.json({
      message: "Succesfully retrieved monthly snapshots",
      data: snapshot,
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
