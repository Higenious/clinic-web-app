import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  CssBaseline,
  Badge,
  Divider,
} from "@mui/material";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Layout = ({ children, selectedPage }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { key: "hospital", text: "Dashboard", icon: <DashboardIcon /> },
    { key: "appointment", text: "Make Appointment", icon: <CalendarMonthIcon /> },
    { key: "settings", text: "Settings", icon: <SettingsIcon /> },
  ];

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Space for AppBar */}
      <Toolbar />
      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected = selectedPage === item.key;
          return (
            <ListItem
              key={item.key}
              button
              onClick={() => {
                navigate(`/${item.key}`);
                setMobileOpen(false);
              }}
              sx={{
                background: isSelected
                  ? "linear-gradient(90deg, #1565c0 0%, #1976d2 100%)"
                  : "transparent",
                color: isSelected ? "#fff" : "#333",
                borderRadius: "8px",
                mx: 1,
                my: 0.5,
                "&:hover": {
                  background: isSelected
                    ? "linear-gradient(90deg, #1565c0 0%, #1976d2 100%)"
                    : "#e3f2fd",
                },
                transition: "background 0.3s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  color: isSelected ? "#fff" : "#1976d2",
                  minWidth: "40px",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isSelected ? "bold" : 500,
                }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* Divider and Logout Button at Bottom */}
      <Divider />
      <ListItem
        button
        onClick={handleLogout}
        sx={{
          color: "error.main",
          borderTop: "1px solid #eee",
          "&:hover": { backgroundColor: "#ffebee" },
          mt: "auto",
        }}
      >
        <ListItemIcon sx={{ color: "error.main" }}>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "white" }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#1976d2",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: "0.5px" }}
          >
            Well Nest
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Permanent Drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "none",
              backgroundColor: "#fafafa",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
