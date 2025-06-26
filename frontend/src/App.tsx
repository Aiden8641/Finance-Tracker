import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage"; // <-- Make sure this file exists
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
