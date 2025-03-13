import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserPage from "./pages/UserPage";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // Auto-logout if the token expires
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        handleLogout();
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* <Route
          path="/admin"
          element={
            token ? (
              <AdminDashboard token={token} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        /> */}
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        <Route path="*" element={<UserPage />} />
        <Route path="/login" element={<AdminLogin setToken={setToken} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
