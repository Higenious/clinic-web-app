import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  Paper,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PersonIcon from '@mui/icons-material/Person';
import HealingIcon from '@mui/icons-material/Healing';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled, keyframes } from "@mui/material/styles";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Layout from '../../utils/Layout';
import { makeAppointment, getDoctorList } from '../../services/service'; 

// --- STYLING ---
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.01); box-shadow: 0 0 10px rgba(25, 118, 210, 0.5); }
  100% { transform: scale(1); }
`;
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  transition: 'all 0.3s',
  '&:hover': {
    animation: `${pulse} 0.5s ease-in-out`,
  },
}));
const StyledButton = styled(Button)(({ theme }) => ({
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6],
  },
}));

// --- MOCK API ---
const getPatientByMobile = async (mobile) => {
  console.log(`Checking patient with mobile: ${mobile}`);
  return null;
};

// --- COMPONENT ---
const AppointmentPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    mobile: '',
    email: '',
    doctorId: '',
    date: null,
    time: null,
    visitType: '',
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [doctorList, setDoctorList] = useState([]);
  const role = localStorage.getItem('role');
  const hospitalId = localStorage.getItem('hospitalId');

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        if (!hospitalId) return;
        const response = await getDoctorList(hospitalId);
        const doctors = response || [];
        setDoctorList(doctors);
        if (doctors.length === 1) {
          setFormData(prev => ({ ...prev, doctorId: doctors[0]._id }));
          setSnackbar({
            open: true,
            message: `Auto-selected Doctor: ${doctors[0].name} 👩‍⚕️`,
            severity: 'info',
          });
        }
      } catch (err) {
        console.error("❌ Failed to load doctors:", err);
        setDoctorList([]);
      }
    };
    fetchDoctors();
  }, [hospitalId]);

  // Validation
  const validateForm = useCallback(() => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.patientName || /\d/.test(formData.patientName)) {
      tempErrors.patientName = 'Name is required and must contain only letters.';
      isValid = false;
    }
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = 'Mobile number must be exactly 10 digits.';
      isValid = false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address.';
      isValid = false;
    }
    if (formData.age < 0) {
      tempErrors.age = 'Age cannot be negative.';
      isValid = false;
    }
    if (!formData.doctorId) {
      tempErrors.doctorId = 'Please select a doctor.';
      isValid = false;
    }
    if (!formData.date) {
      tempErrors.date = 'Appointment date is required.';
      isValid = false;
    }
    if (!formData.time) {
      tempErrors.time = 'Appointment time is required.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  }, [formData]);

  // Handlers
  const handleNameChange = (e) => {
    const { value } = e.target;
    if (/[0-9]/.test(value)) return;
    setFormData(prev => ({ ...prev, patientName: value }));
  };
  const handleMobileInput = (e) => {
    const mobile = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, mobile }));
  };
  const handleMobileBlur = async (e) => {
    const mobile = e.target.value;
    if (mobile.length === 10) {
      const existingPatient = await getPatientByMobile(mobile);
      if (existingPatient) {
        setFormData(prevData => ({ ...prevData, ...existingPatient }));
        setSnackbar({ open: true, message: 'Patient found! 🔍', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'New patient. Please fill details.', severity: 'info' });
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please correct form errors.', severity: 'error' });
      return;
    }

    try {
      const selectedDate = formData.date;
  const selectedTime = formData.time;

  const combined = new Date(
    Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    )
  );

      const payload = {
        patientDetails: {
          name: formData.patientName,
          phone: formData.mobile,
          email: formData.email || '',
          age: formData.age,
          gender: formData.gender,
        },
        doctorId: formData.doctorId,
        hospitalId,
          date: combined.toISOString(),
        visitType: formData.visitType,
      };

      await makeAppointment(payload);

      Swal.fire({
        icon: 'success',
        title: 'Appointment Booked! ✅',
        text: 'The appointment has been scheduled successfully.',
        timer: 2500,
        showConfirmButton: false,
      });

      navigate(`/hospital`);
    } catch (err) {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed 🥺',
        text: 'Error booking appointment. Try again later.',
      });
    }
  };

  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return { minDate: today, maxDate: max };
  }, []);

  return (
    <Layout selectedPage="appointment" role={role}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, color: "#1976d2" }}>
            <CalendarMonthIcon sx={{ mr: 1, fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">Book Appointment 📅</Typography>
          </Box>

          <StyledPaper elevation={10}>
            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3} direction="column">
                <Grid item>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                    <PersonIcon sx={{ verticalAlign: "middle", mr: 0.5 }} /> Patient Information
                  </Typography>
                </Grid>

                {/* Mobile */}
                <Grid item>
                  <TextField
                    label="Mobile Number (10 digits)"
                    name="mobile"
                    fullWidth
                    required
                    value={formData.mobile}
                    onChange={handleMobileInput}
                    onBlur={handleMobileBlur}
                    error={!!errors.mobile}
                    helperText={errors.mobile}
                    inputProps={{ maxLength: 10 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Name */}
                <Grid item>
                  <TextField
                    label="Patient Name"
                    name="patientName"
                    fullWidth
                    required
                    value={formData.patientName}
                    onChange={handleNameChange}
                    error={!!errors.patientName}
                    helperText={errors.patientName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Email */}
                <Grid item>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Age */}
                <Grid item>
                  <TextField
                    label="Age"
                    name="age"
                    type="number"
                    fullWidth
                    value={formData.age}
                    onChange={(e) => {
                      const val = e.target.value < 0 ? 0 : e.target.value;
                      setFormData(prev => ({ ...prev, age: val }));
                    }}
                    error={!!errors.age}
                    helperText={errors.age}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CakeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Gender Radio */}
                <Grid item>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Appointment Details */}
                <Grid item>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="text.secondary"
                    sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}
                  >
                    <HealingIcon sx={{ verticalAlign: "middle", mr: 0.5 }} /> Appointment Details
                  </Typography>
                </Grid>

                {/* Doctor */}
                <Grid item>
                  <FormControl fullWidth required error={!!errors.doctorId}>
                    <InputLabel>Doctor</InputLabel>
                    <Select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      label="Doctor"
                    >
                      {doctorList.length > 0 ? (
                        doctorList.map((doc) => (
                          <MenuItem key={doc._id} value={doc._id}>
                            {doc.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No doctors available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Visit Type */}
                <Grid item>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Visit Type</FormLabel>
                    <RadioGroup
                      row
                      name="visitType"
                      value={formData.visitType}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="New Patient" control={<Radio />} label="New" />
                      <FormControlLabel value="Follow-up" control={<Radio />} label="Follow-up" />
                      <FormControlLabel value="Consultation" control={<Radio />} label="Consultation" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Date + Time */}
                <Grid item>
                  <DatePicker
                    label="Appointment Date"
                    value={formData.date}
                    onChange={(newValue) =>
                      setFormData(prev => ({ ...prev, date: newValue }))
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.date,
                        helperText: errors.date,
                      },
                    }}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </Grid>

                <Grid item>
                  <TimePicker
                    label="Appointment Time"
                    value={formData.time}
                    onChange={(newValue) =>
                      setFormData(prev => ({ ...prev, time: newValue }))
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.time,
                        helperText: errors.time,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <StyledButton
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 4, py: 1.5, fontSize: "1.1rem" }}
              >
                Book Appointment Now!
              </StyledButton>
            </form>
          </StyledPaper>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </LocalizationProvider>
    </Layout>
  );
};

export default AppointmentPage;
