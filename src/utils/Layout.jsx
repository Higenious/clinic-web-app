import React from 'react';
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
import DescriptionIcon from '@mui/icons-material/Description';

import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Layout = ({ children, selectedPage }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'staff';

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
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.key}
            selected={selectedPage === item.key}
            onClick={() => navigate(`/${item.key}`)}
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
            onClick={() => setIsOpen(!isOpen)}
            sx={{ mr: 2, display: { md: 'none' } }}
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

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: { xs: 'none', md: 'block' },
            borderRight: 'none',
          }
        }}
        open
      >
        <Toolbar />
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          }
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          overflowY: 'auto',
          pt: '64px', // Add top padding to account for AppBar height
          width: { md: `calc(100% - ${drawerWidth}px)` }, // Ensures width is correct
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;