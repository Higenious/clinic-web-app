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
import AdminDashboard from "./pages/admin/AdminDashboard";
import PatientHistoryPage from "./pages/doctor/PatientHistoryPage";
import AppointmentsPage from "./pages/common/AppointmentsPage"; 
import { Box } from "@mui/material";

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
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Hospital Routes */}
          <Route
            path="/hospital"
            element={
              <PrivateRoute allowedRoles={["staff", "doctor", "hospital"]}>
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

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Doctor-only */}
          <Route
            path="/patient-history"
            element={
              <PrivateRoute allowedRoles={["doctor"]}>
                <PatientHistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/patient-history/:patientId"
            element={
              <PrivateRoute allowedRoles={["doctor"]}>
                <PatientHistoryPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/prescription/:appointmentId"
            element={
              <PrivateRoute allowedRoles={["doctor"]}>
                <PatientHistoryPage />
              </PrivateRoute>
            }
          />

          {/* Settings (all hospital staff/doctor) */}
          <Route
            path="/settings"
            element={
              <PrivateRoute allowedRoles={["staff", "doctor", "hospital"]}>
                <SettingsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/hospital/appointments"
            element={
              <PrivateRoute allowedRoles={["staff", "doctor", "hospital"]}>
                <AppointmentsPage />
              </PrivateRoute>
            }
          />

          {/* Redirect root based on role */}
          <Route
            path="/"
            element={
              token ? (
                localStorage.getItem("role") === "admin" ? (
                  <Navigate to="/admin" />
                ) : ["doctor", "staff", "hospital"].includes(
                    localStorage.getItem("role")
                  ) ? (
                  <Navigate to="/hospital" />
                ) : (
                  <Navigate to="/login" />
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
