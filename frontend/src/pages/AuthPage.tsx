import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isLogin) {
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
          credentials: "include",
        });

        console.log(response);
        if (!response.ok) {
          throw new Error("Login failed");
        }

        // const data = await response.json();
        // console.log("Login successful:", data);

        navigate("/dashboard");

        // ✅ Save token / update auth state
      } catch (error) {
        console.error("Login error:", error);
      }
    } else {
      try {
        const response = await fetch("http://localhost:3000/signUp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            username: username,
            password: password,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        navigate("/profile");
      } catch (error) {
        console.error("Sign in error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            {isLogin ? "Login to Your Account" : "Create a New Account"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLogin && (
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <Button className="w-full" onClick={handleLogin}>
            {isLogin ? "Login" : "Sign Up"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setUsername("demo_user");
              setPassword("demo");
              handleLogin();
            }}
            className="w-full"
          >
            Demo Login
          </Button>

          <div className="text-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
