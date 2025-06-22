import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const incomeData = [
  { name: "Salary", value: 80000, color: "#4ade80" },
  { name: "Selling", value: 40000, color: "#60a5fa" },
  { name: "Donation", value: 12142, color: "#22d3ee" },
];

const spendingData = [
  { name: "Utilities", value: 3200, color: "#f87171" },
  { name: "Groceries", value: 8500, color: "#fbbf24" },
  { name: "Entertainment", value: 7050, color: "#c084fc" },
  { name: "Rent", value: 9000, color: "#f472b6" },
];

const netData = [
  { day: "Mon", income: 30, outcome: 30 },
  { day: "Tue", income: 15, outcome: 20 },
  { day: "Wed", income: 30, outcome: 12 },
  { day: "Thu", income: 17, outcome: 24 },
  { day: "Fri", income: 46, outcome: 23 },
  { day: "Sat", income: 23, outcome: 23 },
  { day: "Sun", income: 32, outcome: 32 },
];

const recentExpenses = [
  { category: "Transportation", amount: 15, date: "16 Sep", color: "#facc15" },
  { category: "Groceries", amount: 58, date: "17 Sep", color: "#f472b6" },
  { category: "Entertainment", amount: 28, date: "17 Sep", color: "#c084fc" },
  { category: "Rent", amount: 1000, date: "10 Sep", color: "#fb7185" },
];

const goalsData = [
  { goal: "Emergency Fund", progress: 75 },
  { goal: "Vacation", progress: 40 },
  { goal: "New Laptop", progress: 60 },
];

export default function Dashboard() {
  const [goals, setGoals] = useState(goalsData);

  const addGoal = () => {
    const newGoal = prompt("Enter new goal name:");
    const newProgress = prompt("Enter progress percentage:");
    if (newGoal && newProgress !== null) {
      setGoals([
        ...goals,
        { goal: newGoal, progress: parseInt(newProgress, 10) },
      ]);
    }
  };

  return (
    <div className="p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white shadow rounded">
        <h2 className="text-xl font-bold">Welcome, User123</h2>
        <Button
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            window.location.href = "/auth";
          }}
        >
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Total Income</CardTitle>
            <Button size="sm" onClick={() => alert("Edit income modal")}>
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={incomeData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {incomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-xl font-semibold mt-2">
              $132,142
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {spendingData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.name}
                  </span>
                  <span>${item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentExpenses.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.category}
                </span>
                <span className="text-right">
                  ${item.amount}{" "}
                  <span className="block text-sm text-gray-400">
                    {item.date}
                  </span>
                </span>
              </div>
            ))}
            <Button className="w-full mt-4">Add Expense</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compare Net Income and Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={netData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outcome" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Goals</CardTitle>
            <Button size="sm" onClick={addGoal}>
              Add Goal
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span>{goal.goal}</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
