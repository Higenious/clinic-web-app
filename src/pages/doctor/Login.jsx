import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email === 'admin' && password === 'admin') {
      localStorage.setItem('authToken', '12345');
      localStorage.setItem('role', 'admin');
      Swal.fire({ icon: 'success', title: 'Welcome Admin!', text: 'Redirecting...', timer: 1500, showConfirmButton: false });
      setTimeout(() => navigate('/admin'), 1500);
    } else if (email === 'staff' && password === 'staff') {
      localStorage.setItem('authToken', '12345');
      localStorage.setItem('role', 'staff');
      Swal.fire({ icon: 'success', title: 'Welcome Staff!', text: 'Redirecting...', timer: 1500, showConfirmButton: false });
      setTimeout(() => navigate('/hospital'), 1500);
    } else if (email === 'doctor' && password === 'doctor') {
      localStorage.setItem('authToken', '12345');
      localStorage.setItem('role', 'doctor');
      Swal.fire({ icon: 'success', title: 'Welcome Doctor!', text: 'Redirecting...', timer: 1500, showConfirmButton: false });
      setTimeout(() => navigate('/hospital'), 1500);
    } else {
      Swal.fire({ icon: 'error', title: 'Login Failed', text: 'Invalid username or password' });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" fontWeight="bold">
            Clinic Portal
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mt: 1, mb: 3 }}>
            {getGreeting()} 👋
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2' }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;