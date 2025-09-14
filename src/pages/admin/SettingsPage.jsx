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
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
const SettingPage = () => {
  const [role, setRole] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "staff");
    // You would typically load settings from a backend here
  }, []);

  const handleSaveSettings = () => {
    // This is where you would send the updated settings to your backend API
    console.log("Saving settings:", {
      darkMode,
      emailNotifications,
      // Add other settings data here
    });
    alert("Settings saved successfully!");
  };

  return (
    <Layout
      selectedPage='settings'
      role={role}
    >
       <Box sx={{
        p: 3
      }}>


<Box sx={{ display: "flex", alignItems: "center", mb: 2, color: "#1976d2" }}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Settings
          </Typography>
        </Box>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Settings
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* User Interface Preferences Section */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            User Preferences
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            }
            label="Enable Dark Mode"
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
              />
            }
            label="Receive Email Notifications"
            sx={{ mb: 3 }}
          />

          <Divider sx={{ mb: 3 }} />

          {/* Profile and Security Section */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Profile & Security
          </Typography>
          <TextField fullWidth label="Name" sx={{ mt: 1, mb: 2 }} />
          <TextField fullWidth label="Email" sx={{ mb: 2 }} disabled defaultValue="user@example.com" />
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" sx={{ mb: 3 }}>
            Update Password
          </Button>

          {role === "doctor" && (
            <>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Doctor Settings
              </Typography>
              <TextField
                fullWidth
                label="Default Appointment Duration (mins)"
                sx={{ mt: 1, mb: 2 }}
              />
              <FormControlLabel
                control={<Switch />}
                label="Allow Online Booking"
                sx={{ mb: 2 }}
              />
            </>
          )}

          {role === "admin" && (
            <>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Admin Controls
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable New User Registration"
                sx={{ mb: 2 }}
              />
              <Button variant="outlined" sx={{ mb: 2 }}>
                Backup Database
              </Button>
            </>
          )}

          <Divider sx={{ my: 3 }} />
          <Button variant="contained" onClick={handleSaveSettings}>
            Save All Settings
          </Button>
        </Paper>
      </Box>
    </Layout>
  );
};

export default SettingPage;