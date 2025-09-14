import React, { useState } from 'react';
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
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';

import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Layout = ({ children, selectedPage }) => {
  // We only need a state for the mobile drawer, as the desktop one is permanent
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'staff';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const menuItems = [
    { key: 'hospital', text: 'Dashboard', icon: <DashboardIcon /> },
    { key: 'appointment', text: 'Make Appointment', icon: <CalendarMonthIcon /> },
    { key: 'patient-entry', text: 'Patient Entry', icon: <PersonIcon /> },
    ...(role === 'doctor'
      ? [
          { key: 'patient-history', text: 'Patient History', icon: <HistoryIcon /> }
        ]
      : []),
    { key: 'settings', text: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto', backgroundColor: '#f5f5f5', height: '100%' }}>
      <Toolbar /> {/* Adds space for the AppBar on mobile */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.key}
            selected={selectedPage === item.key}
            onClick={() => {
              navigate(`/${item.key}`);
              setMobileOpen(false); // Close mobile drawer on click
            }}
            sx={{
              backgroundColor: selectedPage === item.key ? '#e3f2fd' : 'inherit',
              color: selectedPage === item.key ? '#1976d2' : 'inherit',
              '&:hover': {
                backgroundColor: '#e3f2fd',
              }
            }}
          >
            <ListItemIcon sx={{ color: selectedPage === item.key ? '#1976d2' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout} sx={{ mt: 2, color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }} // Only show on small screens
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Well Nest Clinic
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile Drawer (Temporary) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop Drawer (Permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: '100vh',
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px', // Add top margin to avoid content under AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;