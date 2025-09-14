import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import Layout from '../../utils/Layout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UserChart from '../../UserChart'; 
import SignupChart from '../../SignupChart';
import VisitTypePieChart from '../../VisitTypePieChart';

// Function to get a greeting based on the time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const AdminDashboard = () => {
  return (
    <Layout selectedPage="admin-dashboard">
      {/* This main Box ensures the entire content uses the full width */}
      <Box sx={{
        flexGrow: 1,
        p: 3,
        mt: 8,
        width: '100%',
      }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#1976d2' }}>
          <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            {getGreeting()}, Admin 👋
          </Typography>
        </Box>

        {/* Section 1: Summary Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" gutterBottom>Total Users</Typography>
                <Typography variant="h4" fontWeight="bold">1,024</Typography>
              </Box>
              <PeopleIcon sx={{ color: '#1976d2', fontSize: 60 }} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" gutterBottom>New Sign-ups</Typography>
                <Typography variant="h4" fontWeight="bold">54</Typography>
              </Box>
              <PersonAddIcon sx={{ color: '#4caf50', fontSize: 60 }} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" gutterBottom>Average Response</Typography>
                <Typography variant="h4" fontWeight="bold">123ms</Typography>
              </Box>
              <AccessTimeIcon sx={{ color: '#ff9800', fontSize: 60 }} />
            </Paper>
          </Grid>
        </Grid>

        {/* Section 2: Line Charts (EACH IN ITS OWN GRID CONTAINER) */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                User Statistics Over Time
              </Typography>
              <UserChart />
            </Paper>
          </Grid>
        </Grid>
        
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                New Sign-ups Over Time
              </Typography>
              <SignupChart />
            </Paper>
          </Grid>
        </Grid>

        {/* Section 3: Patient Visit Pie Chart */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Patient Visit Types
              </Typography>
              <VisitTypePieChart />
            </Paper>
          </Grid>
        </Grid>

        {/* Section 4: Recent Activities */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Recent Activities
          </Typography>
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            <Typography variant="body1" paragraph>
              - User JohnDoe123 signed up on 2024-05-14.
            </Typography>
            <Typography variant="body1" paragraph>
              - User JaneSmith updated profile information.
            </Typography>
            <Typography variant="body1" paragraph>
              - Admin performed system maintenance.
            </Typography>
            <Typography variant="body1" paragraph>
              - A new appointment was created for Peter Jones.
            </Typography>
            <Typography variant="body1" paragraph>
              - A new patient record for Sarah Lee was added.
            </Typography>
          </Box>
        </Paper>

        {/* Section 5: System Health */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            System Health
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1">
                <Box component="span" fontWeight="bold">Server Status:</Box> Online
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1">
                <Box component="span" fontWeight="bold">Database:</Box> Healthy
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1">
                <Box component="span" fontWeight="bold">API Latency:</Box> 123ms
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1">
                <Box component="span" fontWeight="bold">Error Rate:</Box> 0.02%
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  );
};

export default AdminDashboard;