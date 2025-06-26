import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

interface Snapshot {
  id: number;
  user_id: number;
  income: number;
  total_expenses: number;
}

export default function CompareNetIncomeAndSpent() {
  const [data, setData] = useState<Snapshot[]>([]);

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/monthly_snapshots",
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch monthly snapshots");
        }

        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching monthly snapshots:", error);
      }
    };

    fetchSnapshots();
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedData = months.map((month, index) => {
    const snapshot = data[index];
    return {
      name: month,
      income: snapshot?.income || 0,
      expenses: snapshot?.total_expenses || 0,
    };
  });

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Compare Net Income and Spent</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={formattedData}>
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
