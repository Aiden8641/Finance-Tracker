import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TotalIncome from "./TotalIncome";
import TotalSpent from "./TotalSpent";
import TotalExpenses from "./RecentExpenses";
import CompareNetIncomeAndSpent from "./CompareNetIncomeAndSpent";
import Goals from "./Goals";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  email: string;
  username: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:3000/user", {
          method: "GET",
          credentials: "include", // send cookies for session auth
        });
        if (!res.ok) throw new Error("Failed to fetch user");

        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        // optionally handle error, e.g., redirect to login
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white shadow rounded">
        <h2 className="text-xl font-bold">
          Welcome, {user ? user.username : "Loading..."}
        </h2>
        <Button
          onClick={async () => {
            await fetch("http://localhost:3000/logout", {
              method: "POST",
              credentials: "include", // include cookies if using session auth
            });

            navigate("/auth");
          }}
        >
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TotalIncome />
        <TotalSpent />
        <TotalExpenses />
        <CompareNetIncomeAndSpent />
        <Goals />
      </div>
    </div>
  );
}
