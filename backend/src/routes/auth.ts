import { Router } from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import { sql } from "../postgreSQL/db";
import { sanitizeUser } from "../middleware/user";
import { usersResponse } from "../@types/types";

const router = Router();

passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const [user]: [usersResponse] =
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
  const [user]: [usersResponse] =
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
      const user = req.user as usersResponse;

      const safeUser = sanitizeUser(user);

      res.status(200).json({
        user_data: safeUser,
        message: "Successfully logged in!",
      });
    } catch (error) {
      return next({ status: 500, error: "Error while logging in!" });
    }
  },
);

router.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    // res.redirect("/");
    res.status(200).json({ message: "Successfully logged out!" });
  });
});

router.post("/signUp", (req, res, next) => {
  try {
    const user = req.body as { username: string; password: string };
    const saltOrRounds = 10;

    bcrypt.hash(user.password, saltOrRounds, async function (err, hash) {
      if (err) {
        return next({
          status: 500,
          error: "Something went wrong! Please try again later!",
        });
      }
      try {
        await sql.begin(async (sql) => {
          const [{ id: user_id }] =
            await sql`INSERT INTO users (username, hashed_password) 
              VALUES (${user.username}, ${hash}) RETURNING id
            `;

          await sql`INSERT INTO budget_allocations (user_id) VALUES (${user_id})`;
          await sql`INSERT INTO Financial_profiles (user_id) VALUES (${user_id})`;
        });
        res.status(201).json("Successfully Signed Up!");
      } catch (error) {
        console.log(error);

        return next({
          status: 500,
          error: "Unable to create new user. Please try again later!",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return next({
      status: 500,
      error: "Error while signing up. Please try again later!",
    });
  }
});

export default router;
