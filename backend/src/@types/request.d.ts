import { Express } from "express";
import {
  budget_allocations,
  expenses,
  financial_profiles,
  goals,
  monthly_bonuses,
  users,
} from "./types";

declare module "express" {
  interface Request {
    body:
      | users
      | financial_profiles
      | monthly_bonuses
      | expenses
      | budget_allocations
      | goals;
  }
}
