// TODO: setup routes
import { Router } from "express";

const router = Router();

router.get("/financial_profile");
router.put("/financial_profile");

router.get("/monthly_bonuses");
router.get("/monthly_bonuses/:id");
router.post("/monthly_bonuses");
router.put("/monthly_bonuses");
router.delete("/monthly_bonuses");

router.get("/budget_allocation");
router.put("/budget_allocation");

router.get("/expenses");
router.get("/expenses/:id");
router.post("/expenses", async (req, res, next) => {});
router.put("/expenses");
router.delete("/expenses/:expense_id", async (req, res, next) => {});

export default router;
