import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginOthersPage from "./pages/LoginOthersPage";
import HomePage from "./pages/Admin/HomePage";
import HospitalAdmin from "./pages/HospitalAdmin";
import Reception from "./pages/Reception";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import RegisterPage from "./pages/RegisterPage";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    window.location.href = "/login";
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/superAdminlogin" replace />} />

        <Route path="/superAdminlogin" element={<SuperAdminLogin />} />
        <Route path="/otherslogin" element={<LoginOthersPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> --- IGNORE */}
        <Route
          path="/superadmin"
          element={<HomePage onLogout={handleLogout} />}
        />
        <Route path="/hospital" element={<HospitalAdmin />} />
        {/* <Route path="/superlogin" element={<SuperLogin />} /> */}
        <Route
          path="/reception"
          element={<Reception onLogout={handleLogout} />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
