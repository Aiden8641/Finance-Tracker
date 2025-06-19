import { Express, Request } from "express";
import {
  user,
  budgetAllocation,
  expenses,
  livingCosts,
  savingFunds,
  investments,
  guiltFreeSpending,
  savingFundsRequest,
  investmentsRequest,
} from "./user";

interface financialBody {
  userUpdate?: user;
  budgetAllocationUpdate?: budgetAllocation;
  livingCostsUpdate?: livingCosts;
  savingFundsUpdate?: savingFundsRequest;
  investmentsUpdate?: investmentsRequest;
  guiltFreeSpendingUpdate?: guiltFreeSpending;
  expenses?: expenses;
}

interface financialRequest extends Request {
  body: financialBody;
}

interface newUserRequest extends Request {
  username: string;
  password: string;
}
