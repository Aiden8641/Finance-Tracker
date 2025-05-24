interface user {
  networth: {
    nonLiquidAssets: number;
    liquidAssets: number;
    savings: number;
    cash: number;
    debt: number;
  };
  monthlyCashIn: {
    monthlyIncome: number;
    otherIncome: number | null;
    bonus: number | null;
    remainingBalance: number;
  };
  monthlyCashOut: {
    monthlyBudget: budget;
    others: otherSpending;
  };
}

interface budget {
  // monthly cash out
  disposableIncome: number;
  splitRatios: number[]; // percent of remaing [0.4, 0.4, 0.2]
  budgetBreakDown: {
    livingCosts: livingCosts;
    savingsFunds: savingsFunds;
    investments: investments;
    guiltFreeSpending: guiltFreeSpending;
  };
}

interface livingCosts {
  rent: number;
  bills: number; // gass, water, electric, internet, phone, etc
  insurance: number; // health, auto, home, etc
  transportation: number;
  debtPayments: number;
  groceries: number;
  others: otherSpending[];
  bufferPercent?: number; // percent from 0 - 100, default is 5%
  bufferAmount?: number;
}

interface savingsFunds {
  splitRatios: number[]; // percent of remaing [0.5, 0.3, 0.2]
  emergencyFund: number;
  vacationFund: number;
  giftsFund: number;
  others: otherSpending[];
}

interface investments {
  splitRatios: number[]; // percent of remaing [0.3, 0.5, 0.2]
  retirementSavings: number;
  stocks: number;
  bonds: number;
  others: otherSpending[];
}

interface guiltFreeSpending {
  personal: number;
  dining: number;
  kids: number;
  sports: number;
  entertainment: number;
  other: otherSpending[];
}

interface otherSpending {
  label: string;
  amount: number;
}
