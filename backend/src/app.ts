import e, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import { configDotenv } from "dotenv";
import { checkDBConnection, setupDB } from "./postgreSQL/db";
import { dropTables } from "./postgreSQL/drops";

//routes
import auth from "./routes/auth";
import budget from "./routes/budget";
import user from "./routes/user";

configDotenv();

const app = e();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
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

app.use(auth);

// app.use(passport.authenticate("session"));

app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.isAuthenticated()) {
      console.log("User is Authenticated");
      return next();
    }
    res.json({ message: "User is not Authenticated" });
  } catch (error) {
    return next(error);
  }
});

app.use(budget);
app.use(user);

app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
  await checkDBConnection();
  // await dropTables();
  await setupDB();
});
