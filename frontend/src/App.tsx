import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage"; // <-- Make sure this file exists

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Wrap AuthPage to accept login callback
  // const AuthPageWrapper = ({ setIsAuthenticated }) => (
  //   <AuthPage
  //     onLogin={() => {
  //       setIsAuthenticated(true);
  //     }}
  //   />
  // );

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        {/* <Route */}
        {/*   path="/auth" */}
        {/*   element={<AuthPageWrapper setIsAuthenticated={setIsAuthenticated} />} */}
        {/* /> */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Default Redirect */}
        {/* <Route */}
        {/*   path="*" */}
        {/*   element={ */}
        {/*     <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace /> */}
        {/*   } */}
        {/* /> */}
      </Routes>
    </Router>
  );
}

export default App;
