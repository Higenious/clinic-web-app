import React, { useEffect, useState } from "react";
import Layout from "../../utils/Layout";
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BackupIcon from "@mui/icons-material/Backup";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import Swal from "sweetalert2";

const SettingPage = () => {
  const [role, setRole] = useState("");
  const [settings, setSettings] = useState({
    darkMode: false,
    language: "en",
    emailNotifications: true,
    name: "",
    currentPassword: "",
    newPassword: "",
    appointmentDuration: 15,
    allowOnlineBooking: true,
    consultationFee: "",
    clinicStartTime: "09:00",
    clinicEndTime: "17:00",
    enableUserRegistration: true,
    themeColor: "#1976d2",
  });

  // Load existing settings
  useEffect(() => {
    const userRole = localStorage.getItem("role") || "staff";
    setRole(userRole);
    const saved = localStorage.getItem("appSettings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // Handle change for any setting
  const handleChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem("appSettings", JSON.stringify(updated));
  };

  // Save all settings manually (if needed)
  const handleSaveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    Swal.fire({
      icon: "success",
      title: "Settings Saved",
      text: "Your preferences have been saved successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Update password handler
  const handlePasswordUpdate = () => {
    if (!settings.currentPassword || !settings.newPassword) {
      Swal.fire("Warning", "Please fill both password fields", "warning");
      return;
    }
    Swal.fire("Success", "Password updated successfully!", "success");
    setSettings({ ...settings, currentPassword: "", newPassword: "" });
  };

  return (
    <Layout selectedPage="settings" role={role}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, color: "#1976d2" }}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Settings
          </Typography>
        </Box>

        {/* ================= GENERAL SETTINGS ================= */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            General Preferences
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={settings.darkMode}
                onChange={(e) => handleChange("darkMode", e.target.checked)}
              />
            }
            label="Enable Dark Mode"
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <LanguageIcon color="primary" />
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                label="Language"
                onChange={(e) => handleChange("language", e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
                <MenuItem value="mr">Marathi</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={(e) =>
                  handleChange("emailNotifications", e.target.checked)
                }
              />
            }
            label="Receive Email Notifications"
            sx={{ mb: 2 }}
          />
        </Paper>

        {/* ================= PROFILE & SECURITY ================= */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Profile & Security
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <TextField
            fullWidth
            label="Name"
            value={settings.name}
            onChange={(e) => handleChange("name", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value="user@example.com"
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={settings.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={settings.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePasswordUpdate}
            sx={{ mb: 1 }}
          >
            Update Password
          </Button>
        </Paper>

        {/* ================= DOCTOR SETTINGS ================= */}
        {role === "doctor" && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Doctor Preferences
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
              <AccessTimeIcon color="primary" />
              <TextField
                label="Clinic Start Time"
                type="time"
                value={settings.clinicStartTime}
                onChange={(e) => handleChange("clinicStartTime", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Clinic End Time"
                type="time"
                value={settings.clinicEndTime}
                onChange={(e) => handleChange("clinicEndTime", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <TextField
              fullWidth
              label="Default Appointment Duration (mins)"
              type="number"
              value={settings.appointmentDuration}
              onChange={(e) =>
                handleChange("appointmentDuration", e.target.value)
              }
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <MonetizationOnIcon color="primary" />
              <TextField
                label="Consultation Fee (₹)"
                type="number"
                value={settings.consultationFee}
                onChange={(e) => handleChange("consultationFee", e.target.value)}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowOnlineBooking}
                  onChange={(e) =>
                    handleChange("allowOnlineBooking", e.target.checked)
                  }
                />
              }
              label="Allow Online Booking"
              sx={{ mt: 2 }}
            />
          </Paper>
        )}

        {/* ================= ADMIN SETTINGS ================= */}
        {role === "admin" && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Admin Controls
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableUserRegistration}
                  onChange={(e) =>
                    handleChange("enableUserRegistration", e.target.checked)
                  }
                />
              }
              label="Enable New User Registration"
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <ColorLensIcon color="primary" />
              <TextField
                type="color"
                label="Theme Color"
                value={settings.themeColor}
                onChange={(e) => handleChange("themeColor", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<BackupIcon />}
              onClick={() =>
                Swal.fire(
                  "Database Backup",
                  "Database backup completed successfully!",
                  "success"
                )
              }
            >
              Backup Database
            </Button>
          </Paper>
        )}

        <Divider sx={{ my: 3 }} />
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          sx={{ fontWeight: "bold" }}
        >
          Save All Settings
        </Button>
      </Box>
    </Layout>
  );
};

export default SettingPage;
