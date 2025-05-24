import { Request } from "express";

interface userRequest extends Request {
  userRequest: user;
}

interface budgetRequest extends Request {
  budgetRequest: budget;
}

interface additionalSpending extends Request {
  otherSpending: otherSpending;
}
