import { Router } from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import { sql } from "../postgreSQL/db";
import {
  budgetAllocation,
  expenses,
  guiltFreeSpending,
  investmentsResponse,
  savingsFundsResponse,
  user,
  userResponse,
} from "../@types/user";
import { sanitizeUser } from "../middleware/user";
import { getUsersBudget } from "../middleware/budget/budget";

const router = Router();

passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const [user]: [userResponse] =
        await sql`SELECT * FROM users WHERE username = ${username}`;

      if (!user) {
        return cb(null, false, { message: "Incorrect username or password" });
      }

      // const [hashed_password]: [{ hashed_password: string }] =
      //   await sql`SELECT hashed_password FROM hashed_password WHERE user_id = ${user.id}`;
      // console.log(hashed_password);

      const isMatch = bcrypt.compare(password, user.hashed_password);

      if (!isMatch) {
        return cb(null, false, { message: "Incorrect username or password" });
      }

      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  }),
);

passport.serializeUser(async function (user, cb) {
  process.nextTick(() => {
    cb(null, { id: user.id });
  });
});

passport.deserializeUser(async function (serializeUser: { id: number }, cb) {
  const [user]: [userResponse] =
    await sql`SELECT * FROM users WHERE id = ${serializeUser.id}`;
  const { hashed_password, ...safeUser } = user;

  return cb(null, safeUser);
});

//TODO: figure logic for redirecting when using with react

// successReturnToOrRedirect: "/",
// failureRedirect: "/login",
router.post(
  "/login",
  passport.authenticate("local"),
  async (req, res, next) => {
    try {
      // console.log(req.session);
      // console.log(req.session.passport.user.id);
      const user = req.user as userResponse;

      const safeUser = sanitizeUser(user);

      const [budgetAllocation]: [budgetAllocation] = await sql`
        SELECT * FROM budgetAllocation
        WHERE user_id = ${safeUser.id};
      `;

      const budget_Id = budgetAllocation.id;

      const [investments]: [investmentsResponse] = await sql`
        SELECT * FROM investments
        WHERE budget_id = ${budget_Id};
      `;

      const [savingFunds]: [savingsFundsResponse] = await sql`
        SELECT * FROM savingFunds
        WHERE budget_id = ${budget_Id};
      `;

      const [guiltFreeSpendings]: [guiltFreeSpending] = await sql`
        SELECT * FROM guiltFreeSpendings
        WHERE budget_id = ${budget_Id};
      `;

      const expenses: [expenses] = await sql`
        SELECT * FROM otherExpenses
        WHERE budget_id = ${budget_Id};
      `;

      // console.log({
      //   data: {
      //     user: safeUser,
      //     budgetAllocation: budgetAllocation,
      //     investments: investments,
      //     savingFunds: savingFunds,
      //     guiltFreeSpendings: guiltFreeSpendings,
      //     expenses: expenses,
      //   },
      // });

      res.json({
        message: "Successfully logged in!",
        data: {
          user: safeUser,
          budgetAllocation: budgetAllocation,
          investments: investments,
          savingFunds: savingFunds,
          guiltFreeSpendings: guiltFreeSpendings,
          expenses: expenses,
        },
      });
    } catch (error) {
      return next(error);
    }
  },
);

router.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    // res.redirect("/");
    res.json("Successfully logged out!");
  });
});

router.post("/signUp", (req, res, next) => {
  try {
    const user = req.body as { username: string; password: string };
    const saltOrRounds = 10;

    console.log(user);

    bcrypt.hash(user.password, saltOrRounds, async function (err, hash) {
      await sql.begin(async (sql) => {
        const [{ id: user_id }] =
          await sql`INSERT INTO users (username, hashed_password) VALUES (${user.username}, ${hash}) RETURNING id`;

        // await sql`INSERT INTO hashed_password (user_id, hashed_password) VALUES (${user_id}, ${hash})`;
        const [{ id: budget_id }] =
          await sql`INSERT INTO budgetAllocation (user_id) VALUES (${user_id}) RETURNING id`;

        await sql`INSERT INTO livingCosts (budget_id) VALUES (${budget_id})`;
        await sql`INSERT INTO savingFunds (budget_id) VALUES (${budget_id})`;
        await sql`INSERT INTO investments (budget_id) VALUES (${budget_id})`;
        await sql`INSERT INTO guiltFreeSpendings (budget_id) VALUES (${budget_id})`;
      });
    });

    res.json("Successfully Signed Up!");
  } catch (error) {
    return next(error);
  }
});

export default router;
