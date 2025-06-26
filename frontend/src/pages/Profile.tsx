import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UpdateFinancialForm() {
  const navigate = useNavigate();
  const [financialProfile, setFinancialProfile] = useState({
    income: "",
    dividend_and_other_income: "",
  });

  const [budgetAllocation, setBudgetAllocation] = useState({
    percent_needs: "50",
    percent_wants: "30",
    percent_savings: "20",
  });

  const handleFinancialChange = (e: any) => {
    setFinancialProfile({
      ...financialProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleBudgetChange = (e: any) => {
    setBudgetAllocation({
      ...budgetAllocation,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const total =
      parseFloat(budgetAllocation.percent_needs) +
      parseFloat(budgetAllocation.percent_wants) +
      parseFloat(budgetAllocation.percent_savings);

    if (total !== 100) {
      alert("Budget allocation must add up to 100%.");
      return;
    }

    if (
      !financialProfile.income ||
      !financialProfile.dividend_and_other_income
    ) {
      alert("Income and Dividends must be provided.");
      return;
    }

    try {
      console.log(financialProfile);
      const financial_profile_response = await fetch(
        "http://localhost:3000/financial_profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...financialProfile,
          }),
        },
      );
      const budget_allocation_response = await fetch(
        "http://localhost:3000/budget_allocation",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...budgetAllocation,
          }),
        },
      );

      if (!financial_profile_response.ok || !budget_allocation_response.ok) {
        throw new Error("Failed to update");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Update Financial Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium mb-1">Income</p>
            <Input
              inputMode="numeric"
              name="income"
              value={financialProfile.income}
              onChange={handleFinancialChange}
              placeholder="Enter your income"
              required
            />
          </div>
          <div>
            <p className="font-medium mb-1">Dividends and Other Income</p>
            <Input
              inputMode="numeric"
              name="dividend_and_other_income"
              value={financialProfile.dividend_and_other_income}
              onChange={handleFinancialChange}
              placeholder="Enter dividends and other income"
              required
            />
          </div>
          <hr className="my-4" />
          <div>
            <p className="font-medium mb-1">Percent Need</p>
            <Input
              inputMode="numeric"
              name="percent_needs"
              value={budgetAllocation.percent_needs}
              onChange={handleBudgetChange}
              placeholder="% of budget for needs. Default is 50%"
              required
            />
          </div>
          <div>
            <p className="font-medium mb-1">Percent Wants</p>
            <Input
              inputMode="numeric"
              name="percent_wants"
              value={budgetAllocation.percent_wants}
              onChange={handleBudgetChange}
              placeholder="% of budget for wants. Default is 30%"
              required
            />
          </div>
          <div>
            <p className="font-medium mb-1">Percent Savings</p>
            <Input
              inputMode="numeric"
              name="percent_savings"
              value={budgetAllocation.percent_savings}
              onChange={handleBudgetChange}
              placeholder="% of budget for savings. Default is 20%"
              required
            />
          </div>
          <Button className="w-full mt-4" onClick={handleSubmit}>
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
