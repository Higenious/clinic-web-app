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
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Swal from 'sweetalert2';
import Layout from '../../utils/Layout';

// Mock patient data for searching
const mockPatients = [
  { mobile: '1234567890', patientName: 'Anil Kumar', age: 35, gender: 'Male', briefMedicalEntry: 'Regular check-up', reasonForVisit: 'Routine check-up' },
  { mobile: '0987654321', patientName: 'Priya Sharma', age: 42, gender: 'Female', briefMedicalEntry: 'History of migraines', reasonForVisit: 'Migraine consultation' },
];

// Mock API functions (replace with your actual API calls)
const makeAppointment = async (appointmentData) => {
  console.log('API call to book appointment:', appointmentData);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const getPatientByMobile = async (mobile) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patient = mockPatients.find(p => p.mobile === mobile);
      resolve(patient || null);
    }, 500);
  });
};

const availableDoctors = [
  { name: 'Dr. Jane Smith', id: 1 },
  { name: 'Dr. Robert Johnson', id: 2 },
  { name: 'Dr. Emily White', id: 3 },
];

const AppointmentPage = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    mobile: '',
    briefMedicalEntry: '',
    reasonForVisit: '',
    bp: '',
    sugar: '',
    pulse: '',
    doctorName: '',
    date: '',
    time: '',
    visitType: '',
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const role = localStorage.getItem('role');

  const validateForm = () => {
    let tempErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(formData.date);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);

    if (!formData.patientName || /\d/.test(formData.patientName)) {
      tempErrors.patientName = 'Patient name is required and cannot contain numbers.';
    }

    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = 'Mobile number must be exactly 10 digits.';
    }

    if (!formData.doctorName) {
      tempErrors.doctorName = 'Please select a doctor.';
    }

    if (!formData.date || selectedDate < today) {
      tempErrors.date = 'Appointment date cannot be in the past.';
    } else if (selectedDate > maxDate) {
      tempErrors.date = 'Appointments can only be made for the next 5 days.';
    }

    const [hours] = formData.time.split(':').map(Number);
    if (!formData.time || hours < 10 || hours >= 21) {
      tempErrors.time = 'OPD hours are from 10:00 AM to 9:00 PM.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMobileChange = async (e) => {
    const mobile = e.target.value;
    setFormData({ ...formData, mobile: mobile });

    if (mobile.length === 10 && /^\d{10}$/.test(mobile)) {
      const existingPatient = await getPatientByMobile(mobile);
      if (existingPatient) {
        setFormData(prevData => ({
          ...prevData,
          ...existingPatient,
        }));
        setSnackbar({ open: true, message: 'Patient details found!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'New patient. Please fill in the details.', severity: 'info' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await makeAppointment(formData);
        Swal.fire({
          icon: 'success',
          title: 'Appointment Booked!',
          text: 'The appointment has been scheduled successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
        setFormData({
          patientName: '',
          age: '',
          gender: '',
          mobile: '',
          briefMedicalEntry: '',
          reasonForVisit: '',
          bp: '',
          sugar: '',
          pulse: '',
          doctorName: '',
          date: '',
          time: '',
          visitType: '',
        });
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

  const getMinMaxDates = () => {
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);
    const maxDateString = maxDate.toISOString().split('T')[0];
    return { min: minDate, max: maxDateString };
  };

  const { min, max } = getMinMaxDates();

  return (
    <Layout selectedPage="appointment" role={role}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#1976d2' }}>
          <CalendarMonthIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Book Appointment
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Patient Information Section */}
              <Typography variant="subtitle1" fontWeight="bold">Patient Information</Typography>
              <TextField
                label="Mobile Number"
                name="mobile"
                fullWidth
                value={formData.mobile}
                onChange={handleMobileChange}
                error={!!errors.mobile}
                helperText={errors.mobile}
                inputProps={{ maxLength: 10 }}
              />
              <TextField
                label="Patient Name"
                name="patientName"
                fullWidth
                value={formData.patientName}
                onChange={handleChange}
                error={!!errors.patientName}
                helperText={errors.patientName}
              />
              <TextField
                label="Age"
                name="age"
                fullWidth
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>
              <TextField
                label="Reason for Visit"
                name="reasonForVisit"
                fullWidth
                multiline
                rows={2}
                value={formData.reasonForVisit}
                onChange={handleChange}
              />

              {/* Optional Vitals Section */}
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }}>Optional Vitals</Typography>
              <TextField
                label="BP (optional)"
                name="bp"
                fullWidth
                value={formData.bp}
                onChange={handleChange}
              />
              <TextField
                label="Sugar (optional)"
                name="sugar"
                fullWidth
                value={formData.sugar}
                onChange={handleChange}
              />
              <TextField
                label="Pulse (optional)"
                name="pulse"
                fullWidth
                value={formData.pulse}
                onChange={handleChange}
              />

              {/* Appointment Details Section */}
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Appointment Details</Typography>
              <FormControl fullWidth error={!!errors.doctorName}>
                <InputLabel id="doctor-select-label">Doctor's Name</InputLabel>
                <Select
                  labelId="doctor-select-label"
                  name="doctorName"
                  value={formData.doctorName}
                  label="Doctor's Name"
                  onChange={handleChange}
                >
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
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Visit Type</FormLabel>
                <RadioGroup
                  row
                  name="visitType"
                  value={formData.visitType}
                  onChange={handleChange}
                >
                  <FormControlLabel value="New Patient" control={<Radio />} label="New Patient" />
                  <FormControlLabel value="Follow-up" control={<Radio />} label="Follow-up" />
                  <FormControlLabel value="Consultation" control={<Radio />} label="Consultation" />
                </RadioGroup>
              </FormControl>
              <TextField
                type="date"
                label="Appointment Date"
                name="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
                inputProps={{ min, max }}
              />
              <TextField
                type="time"
                label="Appointment Time"
                name="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.time}
                onChange={handleChange}
                error={!!errors.time}
                helperText={errors.time}
              />
            </Box>
            <Button variant="contained" type="submit" fullWidth sx={{ mt: 3, py: 1.5 }}>
              Book Appointment
            </Button>
          </form>
        </Paper>
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