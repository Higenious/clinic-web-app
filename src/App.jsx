import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Pages
import LoginPage from "../src/pages/doctor/Login";
import HospitalDashboard from "./pages/doctor/HospitalDashboard";
import AppointmentPage from "./pages/patient/AppointmentPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminDashboard from "./pages/admin/AdminDashboard"
import PatientHistoryPage from "./pages/doctor/PatientHistoryPage";
import { Box } from '@mui/material'; // Import Box

// Optional: Protects any route from unauthorized access
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const token = localStorage.getItem("authToken");

  return (
    <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Doctor and Staff Routes */}
        <Route
          path="/hospital"
          element={
            <PrivateRoute allowedRoles={["staff", "doctor"]}>
              <HospitalDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointment"
          element={
            <PrivateRoute allowedRoles={["staff", "doctor"]}>
              <AppointmentPage />
            </PrivateRoute>
          }
        />
                <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Doctor-only Routes */}
        <Route
          path="/patient-history"
          element={
            <PrivateRoute allowedRoles={["doctor"]}>
              <PatientHistoryPage />
            </PrivateRoute>
          }
        />

        {/* All Authenticated Users */}
        <Route
          path="/settings"
          element={
            <PrivateRoute allowedRoles={["staff", "doctor"]}>
              <SettingsPage />
            </PrivateRoute>
          }
        />

<Route path="/patient-history/:patientId" element={<PatientHistoryPage />} />
        {/* Redirect based on role */}
        <Route
          path="/"
          element={
            token ? (
              localStorage.getItem("role") === "admin" ? (
                // Assuming an admin dashboard exists, but not in this code
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/hospital" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      </Box>
    </Router>
  );
}

export default App;