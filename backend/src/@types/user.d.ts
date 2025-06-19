import { Express, Request } from "express";
import session, { SessionData } from "express-session";
import { Categories } from "../enums/enums";

declare global {
  namespace Express {
    interface User extends user {}
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

interface user {
  id: number;
  username: string;
  non_liquid_assets: number;
  liquid_assets: number;
  savings: number;
  checking: number;
  debt: number;
  monthly_income: number;
  other_income: number;
  bonuses: number;
  availabe_income: number;
}

interface userResponse extends user {
  hashed_password: string;
}

interface budgetAllocation {
  id: number;
  user_id: number;
  savings_ratio: number;
  investments_ratio: number;
  guilt_free_spending_ratio: number;
}

interface livingCosts {
  id: number;
  budget_id: number;
  rent: number;
  bills: number;
  insurance: number;
  transportation: number;
  debt_payments: number;
  groceries: number;
  buffer_percent: number;
}

interface livingCostsResponse extends livingCosts {
  buffer_amount: number;
}

interface savingFundsRatio {
  id: number;
  budget_id: number;
  emergency_fund_ratio: number;
  vacation_fund_ratio: number;
  gifts_fund_ratio: number;
}

interface savingFundsAmount {
  saving_funds_amount: number;
  emergency_fund: number;
  vacation_fund: number;
  gifts_fund: number;
}

interface savingsFundsResponse extends savingFundsRatio, savingFundsAmount {}

interface investmentsRatio {
  id: number;
  budget_id: number;
  retirement_savings_ratio: number;
  stocks_ratio: number;
  bonds_ratio: number;
}

interface investmentsAmount {
  investments_amount: number;
  retirement_savings: number;
  stocks: number;
  bonds: number;
}

interface investmentsResponse extends investmentsRatio, investmentsAmount {}

interface guiltFreeSpending {
  id: number;
  budget_id: number;
  guilt_free_spending_total: number;
}

interface expenses {
  id: number;
  budget_id: number;
  category: Categories;
  label: string;
  expense_amount: number;
}

type budgetCategories =
  | Categories.SavingsFunds
  | Categories.Investments
  | Categories.GuiltFreeSpending;
