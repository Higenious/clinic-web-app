import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Paper,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Swal from 'sweetalert2';
import Layout from '../../utils/Layout';

// Mock API function (replace with your actual API call)
const makeAppointment = async (appointmentData) => {
  console.log('API call to book appointment:', appointmentData);
  // Simulating an API call
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const availableDoctors = [
  { name: 'Dr. Jane Smith', id: 1 },
  { name: 'Dr. Robert Johnson', id: 2 },
  { name: 'Dr. Emily White', id: 3 },
];

const AppointmentPage = () => {
  const [appointment, setAppointment] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    mobile: '',
    visitType: '',
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const role = localStorage.getItem('role');

  const validateForm = () => {
    let tempErrors = {};
    const today = new Date();
    const selectedDate = new Date(appointment.date);
    const selectedTime = appointment.time;

    // Patient Name Validation
    if (!appointment.patientName || /\d/.test(appointment.patientName)) {
      tempErrors.patientName = 'Patient name is required and cannot contain numbers.';
    }

    // Doctor Name Validation
    if (!appointment.doctorName) {
      tempErrors.doctorName = 'Please select a doctor.';
    }

    // Mobile Number Validation
    if (!appointment.mobile || !/^\d{10}$/.test(appointment.mobile)) {
      tempErrors.mobile = 'Mobile number must be exactly 10 digits.';
    }

    // Date Validation
    if (!appointment.date || selectedDate < today.setHours(0, 0, 0, 0)) {
      tempErrors.date = 'Appointment date cannot be in the past.';
    }

    // Time Validation (10 AM to 9 PM)
    const [hours] = selectedTime.split(':').map(Number);
    if (!selectedTime || hours < 10 || hours >= 21) {
      tempErrors.time = 'OPD hours are from 10:00 AM to 9:00 PM.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment({ ...appointment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await makeAppointment(appointment);
        Swal.fire({
          icon: 'success',
          title: 'Appointment Booked!',
          text: 'The appointment has been scheduled successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
        setAppointment({ patientName: '', doctorName: '', date: '', time: '', mobile: '', visitType: '' });
        setErrors({});
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: 'There was an issue booking the appointment. Please try again.',
        });
      }
    } else {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'warning' });
    }
  };

  return (
    <Layout selectedPage="appointment" role={role}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#1976d2' }}>
          <CalendarMonthIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Book Appointment
          </Typography>
        </Box>

        {/* This is the new flex container that holds the two columns */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'flex-start',
            maxWidth: '1200px', // Set a max width to keep content readable
            mx: 'auto' // Center the entire layout
          }}
        >
          {/* Left Column: The Appointment Form */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
              <Typography variant="h6" gutterBottom>Appointment Details</Typography>
              <form onSubmit={handleSubmit} noValidate>
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                    <TextField
                      label="Patient Name"
                      name="patientName"
                      fullWidth
                      value={appointment.patientName}
                      onChange={handleChange}
                      error={!!errors.patientName}
                      helperText={errors.patientName}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Mobile Number"
                      name="mobile"
                      fullWidth
                      value={appointment.mobile}
                      onChange={handleChange}
                      error={!!errors.mobile}
                      helperText={errors.mobile}
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth error={!!errors.doctorName}>
                      <InputLabel id="doctor-select-label">Doctor's Name</InputLabel>
                      <Select
                        labelId="doctor-select-label"
                        name="doctorName"
                        value={appointment.doctorName}
                        label="Doctor's Name"
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>Select Doctor</em>
                        </MenuItem>
                        {availableDoctors.map((doctor) => (
                          <MenuItem key={doctor.id} value={doctor.name}>
                            {doctor.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.doctorName && (
                        <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                          {errors.doctorName}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl component="fieldset" fullWidth>
                      <FormLabel component="legend">Visit Type</FormLabel>
                      <RadioGroup
                        row
                        name="visitType"
                        value={appointment.visitType}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="New Patient" control={<Radio />} label="New Patient" />
                        <FormControlLabel value="Follow-up" control={<Radio />} label="Follow-up" />
                        <FormControlLabel value="Consultation" control={<Radio />} label="Consultation" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <TextField
                      type="date"
                      label="Appointment Date"
                      name="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={appointment.date}
                      onChange={handleChange}
                      error={!!errors.date}
                      helperText={errors.date}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="time"
                      label="Appointment Time"
                      name="time"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={appointment.time}
                      onChange={handleChange}
                      error={!!errors.time}
                      helperText={errors.time}
                    />
                  </Grid>
                </Grid>
                <Button variant="contained" type="submit" fullWidth sx={{ mt: 3, py: 1.5 }}>
                  Book Appointment
                </Button>
              </form>
            </Paper>
          </Box>

          {/* Right Column: Image and Text */}
          <Box sx={{ flex: 1, mt: { xs: 4, md: 0 } }}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="300"
                image="https://etimg.etb2bimg.com/photo/122497653.cms" // Replace with a real image URL
                alt="Clinic building or waiting room"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Book an Appointment Today!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our clinic is dedicated to providing compassionate and high-quality care. Schedule your visit with our expert doctors today and take the first step towards better health.
                </Typography>
                <Button size="small" variant="text" sx={{ mt: 2 }}>
                  Learn More About Us
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default AppointmentPage;