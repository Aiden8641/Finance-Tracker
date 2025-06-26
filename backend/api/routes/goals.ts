import { Request, Response, NextFunction, Router } from "express";
import { goals } from "../@types/types";
import {
  get_all_goals_by_user_id,
  get_goals_by_id,
  insert_goals,
  update_goals,
  delete_goals,
} from "../middleware/goals";
import { is_authorized_user_by_payload } from "../middleware/verification";

const router = Router();

router.get(
  "/goals",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const goal = await get_all_goals_by_user_id(user as Express.User);

      res.status(200).json({ message: "All goals retrieved", data: goal });
    } catch (error) {
      return next({
        status: 500,
        error: "Error getting all goals related to user",
      });
    }
  },
);
// router.get(
//   "/goals/:id",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = req.user;
//       const goal_id = req.params.id;
//       const goal = await get_goals_by_id(user as Express.User, goal_id);
//
//       if (!goal) {
//         res.status(404).json({
//           message:
//             "Goal not retrieved. No goal with that id found for current user",
//         });
//         return;
//       }
//       res.status(200).json({ message: "Goal found!", data: goal });
//     } catch (error) {
//       return next({
//         status: 500,
//         error: "Error getting goals by id ",
//       });
//     }
//   },
// );
router.post(
  "/goals",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const payload = req.body as goals;
      const goal = await insert_goals(user as Express.User, payload);

      res
        .status(200)
        .json({ message: "Goal Successfully added to user", data: goal });
    } catch (error) {
      return next({ status: 500, error: "Error adding new goal to user" });
    }
  },
);
// router.put(
//   "/goals",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = req.user;
//       const payload = req.body as goals;
//       const goal = await update_goals(user as Express.User, payload);
//
//       if (!goal) {
//         res.status(404).json({
//           message:
//             "Goal not updated. No goal with that id found for current user",
//         });
//         return;
//       }
//
//       res
//         .status(200)
//         .json({ message: "Goal Successfully updated!", data: goal });
//     } catch (error) {
//       return next({ status: 500, error: "Error updating goals" });
//     }
//   },
// );

// router.delete(
//   "/goals/:id",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = req.user;
//       const goal_id = req.params.id;
//
//       const goal = await delete_goals(user as Express.User, goal_id);
//
//       if (goal.count == 0) {
//         res.status(404).json({
//           message:
//             "Goal not deleted. No goal with that id found for current user",
//         });
//         return;
//       }
//
//       res.status(200).json({ message: "Goal has been deleted" });
//     } catch (error) {
//       return next({ status: 500, error: "Error deleting goal" });
//     }
//   },
// );

export default router;
