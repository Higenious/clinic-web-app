import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { styled, keyframes } from '@mui/material/styles';
import ForgotPasswordModal from '../common/ForgotPasswordModal';
import { login, forgotPassword } from '../../services/service';

// ------------------ Styling ------------------
const backgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AnimatedBackgroundBox = styled(Box)(() => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(-45deg, #0b4e87, #1976d2, #42a5f5, #e3f2fd)',
  backgroundSize: '400% 400%',
  animation: `${backgroundAnimation} 20s ease infinite`,
}));

const StyledLoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 5, 4, 5),
  borderRadius: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 15px 45px rgba(20, 50, 80, 0.3)',
  textAlign: 'center',
  overflow: 'visible',
}));

const AnimatedTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#90caf9' },
    '&:hover fieldset': { borderColor: '#1976d2' },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    },
  },
}));

// ------------------ Login Page ------------------
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon ☕';
    return 'Good Evening 🌙';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await login({ email, password });
      const { token, user } = response;

      localStorage.setItem('doctorId', user.id);
      localStorage.setItem('hospitalId', user.hospitalId);
      localStorage.setItem('authToken', token);
      localStorage.setItem('role', user.role);

      Swal.fire({
        icon: 'success',
        title: `Welcome ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}!`,
        text: 'Redirecting...',
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate(user.role === 'admin' ? '/admin' : '/hospital'), 1500);
    } catch (error) {
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Invalid email or password.',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    shake: { x: [0, -12, 12, -12, 12, 0], transition: { duration: 0.5 } },
    hoverShake: { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.4 } },
  };

  return (
    <AnimatedBackgroundBox>
      <Container component="main" maxWidth="xs">
        <AnimatePresence>
          <motion.div
            key="login-card"
            variants={containerVariants}
            initial="hidden"
            animate={shake ? 'shake' : 'visible'}
            whileHover="hoverShake"
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
          >
            <StyledLoginPaper elevation={20}>
              <Box mb={3}>
                <HealthAndSafetyIcon sx={{ fontSize: 50, color: '#1565c0', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0b4e87', mb: 0.5 }}>
                  MediPanels
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getGreeting()} - Access Your Dashboard
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <AnimatedTextField
                  fullWidth
                  required
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password with visibility toggle */}
                <AnimatedTextField
                  fullWidth
                  required
                  id="password"
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 2,
                      mb: 1,
                      py: 1.6,
                      fontSize: '1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(-45deg, #1976d2 30%, #42a5f5 90%)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'SECURE LOGIN'}
                  </Button>
                </motion.div>

  
              </Box>
              {/* Forgot Password Link outside form */}
<Box mt={2} textAlign="right">
  <Link
    component="button"
    variant="body2"
    onClick={() => setForgotOpen(true)}
    sx={{
      color: '#1565c0',
      fontWeight: 600,
      textDecoration: 'underline',
      textTransform: 'none',
      fontSize: '0.9rem',
    }}
  >
    Forgot Password?
  </Link>
</Box>

              {/* ------------------- Forgot Password Modal ------------------- */}
              <ForgotPasswordModal
                open={forgotOpen}
                handleClose={() => setForgotOpen(false)}
                forgotPasswordApi={forgotPassword}
              />
            </StyledLoginPaper>
          </motion.div>
        </AnimatePresence>
      </Container>
    </AnimatedBackgroundBox>
  );
};

export default LoginPage;
