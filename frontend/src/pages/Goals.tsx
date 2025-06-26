import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface goal_type {
  id: number;
  user_id: number;
  description: string;
}

interface response_data {
  message: string;
  data: goal_type[];
}

export default function Goals() {
  const [goals, setGoals] = useState<goal_type[]>([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);
  const fetchGoals = async () => {
    try {
      const response = await fetch("http://localhost:3000/goals", {
        method: "GET",
        credentials: "include", // include cookies if using session auth
      });

      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }

      const data = await response.json();
      console.log("Goals:", data);

      setGoals(data.data);
      return data as response_data;
    } catch (error) {
      console.error("Error fetching goals:", error);
      return [];
    }
  };

  const deleteGoals = async (id: string | number) => {
    try {
      const response = await fetch(`http://localhost:3000/goals/${id}`, {
        method: "DELETE",
        credentials: "include", // include cookies if using session auth
      });

      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }

      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id != id));
    } catch (error) {
      console.error("Error fetching goals:", error);
      return [];
    }
  };

  const addGoals = async (description: string) => {
    console.log(description);
    try {
      const response = await fetch("http://localhost:3000/goals", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }

      setNewGoal("");

      const data: { data: { id: any; user_id: any; description: string } } =
        await response.json();

      setGoals([
        ...goals,
        {
          id: data.data.id,
          user_id: data.data.user_id,
          description: data.data.description,
        },
      ]);
    } catch (error) {
      console.error("Error fetching goals:", error);
      return [];
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Goals</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="font-bold">
              +
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <DialogClose asChild>
              <div className="space-y-4">
                <Input
                  placeholder="Enter goal description"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                />
                <Button onClick={() => addGoals(newGoal)}>Submit</Button>
              </div>
            </DialogClose>
          </DialogContent>
        </Dialog>{" "}
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-64">
          <div className="space-y-4">
            {" "}
            {goals.map((e) => (
              <div
                key={e.id}
                className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800 overflow-hidden">
                    {e.description}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteGoals(e.id)}
                >
                  <Trash />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
