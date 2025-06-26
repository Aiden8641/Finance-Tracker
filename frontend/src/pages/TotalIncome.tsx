import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function TotalIncome() {
  const [Income, setIncome] = useState<any>([]);
  const [incomeInput, setIncomeInput] = useState(0);
  const [dividendsInput, setDividendsInput] = useState(0);

  useEffect(() => {
    fetchIncome().then((e) => {
      console.log(e);
      setIncome([
        { name: "Income", value: e.income, color: "#4ade80" },
        {
          name: "Dividends",
          value: e.dividends_and_other_income,
          color: "#60a5fa",
        },
      ]);
      setIncomeInput(e.income);
      setDividendsInput(e.dividends_and_other_income);
    });
  }, []);

  const fetchIncome = async () => {
    try {
      const response = await fetch("http://localhost:3000/financial_profile", {
        method: "GET",
        credentials: "include", // include cookies if using session auth
      });
      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }

      const data = await response.json();
      const financial_profile = data.data;

      return financial_profile;
    } catch (error) {
      console.error("Error fetching goals:", error);
      return [];
    }
  };

  const handleUpdateIncome = async () => {
    try {
      const financial_profile_response = await fetch(
        "http://localhost:3000/financial_profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            income: incomeInput,
            dividend_and_other_income: dividendsInput,
          }),
        },
      );

      if (!financial_profile_response) {
        throw new Error("Failed to update");
      }
      setIncome([
        { name: "Income", value: incomeInput, color: "#4ade80" },
        { name: "Dividends", value: dividendsInput, color: "#60a5fa" },
      ]);
      window.dispatchEvent(new Event("incomeUpdated"));

      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Total Income</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Income</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <label>Income</label>
              <Input
                inputMode="numeric"
                value={incomeInput}
                onChange={(e) => setIncomeInput(Number(e.target.value))}
                placeholder="Income"
              />
              <label>Dividends and Other Income</label>
              <Input
                inputMode="numeric"
                value={dividendsInput}
                onChange={(e) => setDividendsInput(Number(e.target.value))}
                placeholder="Dividends"
              />
              <DialogClose className="w-full">
                <Button onClick={handleUpdateIncome} className="w-full">
                  Save
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      {Income?.length > 0 && (
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={Income}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
              >
                {Income.map((entry: any, index: any) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center text-xl font-semibold mt-2">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Income[0].value + Income[1].value)}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
