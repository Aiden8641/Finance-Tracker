import { Express, Request } from "express";
import session, { SessionData } from "express-session";
import { Categories } from "../enums/enums";
import { financial_profiles } from "../postgreSQL/tables";

declare global {
  namespace Express {
    interface User extends users {}
  }
}

declare module "express-session" {
  interface SessionData {
    passport: {
      user: {
        id: string;
        username: string;
      };
    };
  }
}

interface users {
  id: number;
  email: string;
  username: string;
}

interface usersResponse extends users {
  hashed_password: string;
}

interface financial_profiles {
  id: number;
  user_id: number;
  income: number;
  dividend_and_other_income: number;
}

interface monthly_bonuses {
  id: number;
  user_id: number;
  description: string;
  amount: number;
}

interface budget_allocations {
  id: number;
  user_id: number;
  percent_need: number;
  percent_wants: number;
  percent_savings: number;
}

interface budget_monthly_snapshots {
  id: number;
  user_id: number;
  income: number;
  total_expenses: number;
  percent_need: number;
  percent_wants: number;
  percent_savings: number;
}

interface expenses {
  id: number;
  user_id: number;
  category_id: number;
  description: string;
  expense_amount: number;
}

interface goals {
  id: number;
  user_id: number;
  description: string;
}

interface categories {
  id: number;
  category_name: string;
}
