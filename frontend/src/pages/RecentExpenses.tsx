import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Expense {
  id: number;
  user_id: number;
  category_id: number;
  description: string;
  expense_amount: number;
}

export default function TotalExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    expense_amount: "",
    category_id: "1",
  });

  useEffect(() => {
    getExpenses();
  }, []);

  const getExpenses = async () => {
    try {
      const response = await fetch("http://localhost:3000/expenses", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      setExpenses(data.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      console.log(id);
      const response = await fetch(`http://localhost:3000/expenses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete expense");

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      window.dispatchEvent(new Event("expenseAdded"));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const getCategoryColor = (category_id: number) => {
    switch (category_id) {
      case 1:
        return "bg-green-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleAddExpense = async () => {
    try {
      const response = await fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          description: newExpense.description,
          expense_amount: parseFloat(newExpense.expense_amount),
          category_id: parseInt(newExpense.category_id),
        }),
      });

      if (!response.ok) throw new Error("Failed to add expense");

      const data = await response.json();
      setExpenses((prev) => [...prev, data.data]);
      setNewExpense({ description: "", expense_amount: "", category_id: "1" });

      window.dispatchEvent(new Event("expenseAdded"));
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <Card className="lg:col-span-1 h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 overflow-y-auto">
        {expenses.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center py-1 border-b border-gray-200"
          >
            <span className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${getCategoryColor(item.category_id)}`}
              ></span>
              {item.description}
            </span>
            <span className="text-right flex items-center gap-2">
              ${item.expense_amount.toFixed(2)}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteExpense(item.id)}
              >
                ✕
              </Button>
            </span>
          </div>
        ))}
      </CardContent>
      <div className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">
                  Description
                </label>
                <Input
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">
                  Amount
                </label>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Amount"
                  value={newExpense.expense_amount}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      expense_amount: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">
                  Category
                </label>
                <Select
                  value={newExpense.category_id}
                  onValueChange={(val: any) =>
                    setNewExpense({ ...newExpense, category_id: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Needs</SelectItem>
                    <SelectItem value="2">Wants</SelectItem>
                    <SelectItem value="3">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogClose>
                <Button onClick={handleAddExpense} className="w-full">
                  Submit
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
