import { NextFunction, Router } from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import { sql } from "../postgreSQL/db";
import { get_user_by_username, sanitizeUser } from "../middleware/user";
import { custom_error, users, usersResponse } from "../@types/types";

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

      const safe_user = sanitizeUser(user);
      return cb(null, safe_user);
    } catch (error) {
      return cb(error);
    }
  }),
);

passport.serializeUser(async function (user, cb) {
  // do not include and sensitive info here
  process.nextTick(() => {
    cb(null, { id: user.id });
  });
});
passport.deserializeUser(async function (
  serializeUser: { id: number },
  cb: (err: custom_error | null, user?: Express.User | false | null) => void,
) {
  console.log(serializeUser);
  const [user]: [usersResponse] =
    await sql`SELECT * FROM users WHERE id = ${serializeUser.id}`;

  if (!user) {
    return cb(
      { status: 401, error: "User not found!", clear_cookie: true },
      null,
    );
  }
  // make sure password hash is not here for safety
  const safe_user = sanitizeUser(user);

  return cb(null, safe_user);
});

//TODO: figure logic for redirecting when using with react

// successReturnToOrRedirect: "/",
// failureRedirect: "/login",
router.post(
  "/login",
  passport.authenticate("local"),
  async (req, res, next) => {
    try {
      // users
      const user = req.user as usersResponse;
      const user_id = user.id;

      //TODO: data that is needed:
      // Financial_profiles
      // budget_allocations
      // expenses
      // goals
      // const budget_allocations =
      //   await get_budget_allocation_by_user_id(user_id);
      // monthly bonuses

      res.status(200).json({
        data: {
          user: user,
        },
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
      return next({ status: 500, error: err });
    }
    // res.redirect("/");
    req.session.destroy((err) => {
      console.log(err);
    });

    res
      .clearCookie("connect.sid")
      .status(200)
      .json({ message: "Successfully logged out!" });
  });
});

// router.post("/signUp", async (req, res, next) => {
//   try {
//     const user = req.body as {
//       email: string;
//       username: string;
//       password: string;
//     };
//
//     const is_identical_username = await get_user_by_username(user.username);
//
//     if (is_identical_username) {
//       res.status(409).json({
//         message: "Username already taken, please choose a different username!",
//       });
//       return;
//     }
//
//     const saltOrRounds = 10;
//
//     bcrypt.hash(user.password, saltOrRounds, async function (err, hash) {
//       if (err) {
//         return next({
//           status: 500,
//           error: "Something went wrong! Please try again later!",
//         });
//       }
//       try {
//         const added_user = await sql.begin(async (sql) => {
//           const [new_user]: [users] =
//             await sql`INSERT INTO users (email, username, hashed_password)
//               VALUES (${user.email},${user.username}, ${hash}) RETURNING *;
//             `;
//
//           const user_id = new_user.id;
//
//           await sql`INSERT INTO budget_allocations (user_id) VALUES (${user_id})`;
//           await sql`INSERT INTO Financial_profiles (user_id) VALUES (${user_id})`;
//
//           return new_user;
//         });
//
//         req.login(added_user, function (err) {
//           if (err) {
//             return next({
//               status: 500,
//               error:
//                 "Error logging in user after creation. Please try manually logging in!",
//               message: err,
//             });
//           }
//           res.status(201).json("Successfully Signed Up and Logged in!");
//         });
//       } catch (error) {
//         console.log(error);
//
//         return next({
//           status: 500,
//           error: "Unable to create new user. Please try again later!",
//         });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     return next({
//       status: 500,
//       error: "Error while signing up. Please try again later!",
//     });
//   }
// });
//
export default router;
