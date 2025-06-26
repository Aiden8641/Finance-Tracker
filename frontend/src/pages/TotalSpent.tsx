import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CategorySum {
  category_id: number;
  sum: number;
}

interface BudgetAllocation {
  id: number;
  user_id: number;
  percent_needs: number;
  percent_wants: number;
  percent_savings: number;
}

export default function TotalSpent() {
  const [categoryData, setCategoryData] = useState<CategorySum[]>([]);
  const [budget, setBudget] = useState<BudgetAllocation | null>(null);
  const [income, setIncome] = useState<number>(0);

  useEffect(() => {
    fetchCategorySums();
    fetchBudget();

    const handleExpenseAdded = () => {
      fetchCategorySums();
    };

    const handleIncomeUpdated = () => {
      fetchBudget();
    };

    window.addEventListener("expenseAdded", handleExpenseAdded);
    window.addEventListener("incomeUpdated", handleIncomeUpdated);

    return () => {
      window.removeEventListener("expenseAdded", handleExpenseAdded);
      window.removeEventListener("incomeUpdated", handleIncomeUpdated);
    };
  }, []);

  const fetchCategorySums = async () => {
    try {
      const response = await fetch("http://localhost:3000/expenses/category", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch category expenses");
      }

      const data = await response.json();
      setCategoryData(data.data);
    } catch (error) {
      console.error("Error fetching category expenses:", error);
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await fetch("http://localhost:3000/budget_allocation", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch budget allocation");
      }

      const result = await response.json();
      setBudget(result.data);

      const incomeResponse = await fetch(
        "http://localhost:3000/financial_profile",
        {
          method: "GET",
          credentials: "include",
        },
      );
      const incomeResult = await incomeResponse.json();
      setIncome(incomeResult.data.income);
    } catch (error) {
      console.error("Error fetching budget or income:", error);
    }
  };

  const getCategoryColor = (category_id: number) => {
    switch (category_id) {
      case 1:
        return "bg-green-500"; // Needs
      case 2:
        return "bg-yellow-500"; // Wants
      case 3:
        return "bg-blue-500"; // Savings
      default:
        return "bg-gray-400";
    }
  };

  const getCategoryName = (category_id: number) => {
    switch (category_id) {
      case 1:
        return "Needs";
      case 2:
        return "Wants";
      case 3:
        return "Savings";
      default:
        return "Other";
    }
  };

  const getCategoryCap = (category_id: number): number => {
    if (!budget || income === 0) return 10000; // fallback cap
    switch (category_id) {
      case 1:
        return (income * budget.percent_needs) / 100;
      case 2:
        return (income * budget.percent_wants) / 100;
      case 3:
        return (income * budget.percent_savings) / 100;
      default:
        return 10000;
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categoryData.map((item) => {
            const cap = getCategoryCap(item.category_id);
            return (
              <div key={item.category_id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex gap-2 items-center">
                    <span
                      className={`w-3 h-3 rounded-full ${getCategoryColor(item.category_id)}`}
                    ></span>
                    {getCategoryName(item.category_id)}
                  </span>
                  <span>${item.sum.toFixed(2)}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className={`${getCategoryColor(item.category_id)} h-2 rounded-full transition-all duration-300 ease-in-out`}
                    style={{
                      width: `${Math.min((item.sum / cap) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
