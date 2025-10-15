// src/components/ForgotPasswordModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Box,
  InputAdornment,
  MenuItem,
  Typography,
  Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import Swal from 'sweetalert2';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ForgotPasswordModal = ({ open, handleClose, forgotPasswordApi }) => {
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [loading, setLoading] = useState(false);

  // clear input on close
  useEffect(() => {
    if (!open) setMobile('');
  }, [open]);

const handleSend = async () => {
  if (!/^\d{10}$/.test(mobile)) {
    handleClose(); // close the modal first
    setTimeout(() => {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid',
        text: 'Please enter a valid 10-digit mobile number.',
        position: 'center',
      });
    }, 300); // give 300ms for modal close animation
    return;
  }

  setLoading(true);
  try {
    handleClose(); // close modal immediately
    const response = await forgotPasswordApi({ countryCode, mobile });

    Swal.fire({
      icon: response.success ? 'success' : 'error',
      title: response.success ? 'Success' : 'Not Found',
      text: response.message || (response.success ? 'Password sent.' : 'Mobile number not found.'),
      position: 'center',
    });
  } catch (err) {
    console.log(err);
    handleClose();
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong. Try again later.',
      position: 'center',
    });
  } finally {
    setLoading(false);
  }
};


  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) setMobile(val);
  };

  return (
    <Dialog
      open={open}
      onClose={() => { handleClose(); setMobile(''); }}
      TransitionComponent={Transition}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ position: 'relative', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>
          Forgot Password
        </Typography>
        <IconButton
          onClick={() => { handleClose(); setMobile(''); }}
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box mt={2} display="flex" alignItems="center" gap={1}>
          <TextField
            select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            size="small"
            sx={{ width: 140, textAlign: 'center' }}
          >
            <MenuItem value="+91">🇮🇳 +91</MenuItem>
            <MenuItem value="+1">🇺🇸 +1</MenuItem>
            <MenuItem value="+44">🇬🇧 +44</MenuItem>
          </TextField>

          <TextField
            placeholder="Mobile Number"
            value={mobile}
            onChange={handleMobileChange}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Password'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
