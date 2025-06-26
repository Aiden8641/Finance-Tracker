import e, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import { configDotenv } from "dotenv";
import { checkDBConnection, setupDB, dropTables } from "./postgreSQL/db";

//routes
import auth from "./routes/auth";
import users from "./routes/user";
import goals from "./routes/goals";
import expenses from "./routes/expenses";
import budget_allocation from "./routes/budget_allocation";
import financial_profiles from "./routes/financial_profiles";
// import monthy_bonuses from "./routes/monthly_bonuses";
// import monthy_snapshots from "./routes/monthy_snapshots";
//
// import { custom_error } from "./@types/types";
// import { createDemoUser } from "./createDemoUser";

configDotenv();

const app = e();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    credentials: true,
  }),
);

const pgPool = new Pool({
  host: "db.jftfhetgsyjefchfkcgv.supabase.co",
  port: 5432,
  user: "postgres",
  password: "zix36RL90cIFLzLP",
  database: "postgres",
});

const pgStore = connectPgSimple(session);

app.use(
  session({
    store: new pgStore({
      pool: pgPool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: "2;l3k4j&",
    resave: false,
    saveUninitialized: true,
  }),
);

// passport
app.use(passport.initialize());
app.use(passport.session());

app.use(auth); // 2

// app.use((req: Request, res: Response, next: NextFunction) => {
//   try {
//     if (req.isAuthenticated()) {
//       console.log("User is Authenticated");
//       return next();
//     }
//     res.json({ message: "User is not Authenticated" });
//   } catch (error) {
//     return next(error);
//   }
// });

app.use(users); // 1
app.use(goals); // 1
app.use(expenses); // 2
app.use(financial_profiles); // 1
app.use(budget_allocation); // 1
// app.use(monthy_bonuses);

// app.use(monthy_snapshots);
//error handler probably not needed but keeps messages short and concise
// app.use(
//   (err: custom_error, req: Request, res: Response, next: NextFunction) => {
//     if (err.clear_cookie) {
//       res.clearCookie("connect.sid").status(err.status).json(err.error);
//     } else {
//       res.status(err.status).json(err.error);
//     }
//
//     return;
//   },
// );

app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
  await checkDBConnection();
  // await dropTables();
  // await setupDB();
  // await createDemoUser();
});

module.exports = app;
