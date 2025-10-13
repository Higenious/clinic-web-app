import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid, // Grid is no longer used for the form fields
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Swal from 'sweetalert2';
import Layout from '../../utils/Layout';
const PatientEntryPage = () => {
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    medicalHistory: '',
    reasonForVisit: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!patient.name) {
      tempErrors.name = 'Full Name is required.';
      isValid = false;
    } else if (/\d/.test(patient.name)) {
      tempErrors.name = 'Name cannot contain numbers.';
      isValid = false;
    }
    if (!patient.age) {
      tempErrors.age = 'Age is required.';
      isValid = false;
    } else if (isNaN(patient.age) || patient.age <= 0 || patient.age > 120) {
      tempErrors.age = 'Please enter a valid age (1-120).';
      isValid = false;
    }
    if (!patient.gender) {
      tempErrors.gender = 'Gender is required.';
      isValid = false;
    }
    if (!patient.contact) {
      tempErrors.contact = 'Contact Number is required.';
      isValid = false;
    } else if (!/^\d{10}$/.test(patient.contact)) {
      tempErrors.contact = 'Contact Number must be exactly 10 digits.';
      isValid = false;
    }
    if (!patient.address) {
      tempErrors.address = 'Address is required.';
      isValid = false;
    }
    if (!patient.reasonForVisit) {
      tempErrors.reasonForVisit = 'Reason for visit is required.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      Swal.fire({
        icon: 'success',
        title: 'Patient Saved!',
        text: 'Patient information has been saved successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
      setPatient({
        name: '',
        age: '',
        gender: '',
        contact: '',
        address: '',
        medicalHistory: '',
        reasonForVisit: '',
      });
      setErrors({});
    }
  };

  const role = localStorage.getItem('role');

  return (
    <Layout selectedPage="patient-entry" role={role}>
      <Box sx={{
        p: 3
      }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', mb: 2, color: '#1976d2' }}>
          <PersonAddIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            New Patient Entry
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Patient Details</Typography>
          <form onSubmit={handleSubmit} noValidate>
            {/* THIS IS THE CHANGE: Use a Box with flexDirection: 'column' instead of Grid */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Full Name"
                name="name"
                fullWidth
                value={patient.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="Age"
                name="age"
                type="number"
                fullWidth
                value={patient.age}
                onChange={handleChange}
                error={!!errors.age}
                helperText={errors.age}
              />
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={patient.gender}
                  label="Gender"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Select Gender</em>
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>
              <TextField
                label="Contact Number"
                name="contact"
                fullWidth
                value={patient.contact}
                onChange={handleChange}
                error={!!errors.contact}
                helperText={errors.contact}
                inputProps={{ maxLength: 10 }}
              />
              <TextField
                label="Full Address"
                name="address"
                fullWidth
                multiline
                rows={2}
                value={patient.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
              <TextField
                label="Brief Medical History (allergies, past surgeries, etc.)"
                name="medicalHistory"
                fullWidth
                multiline
                rows={3}
                value={patient.medicalHistory}
                onChange={handleChange}
              />
              <TextField
                label="Reason for Visit"
                name="reasonForVisit"
                fullWidth
                multiline
                rows={2}
                value={patient.reasonForVisit}
                onChange={handleChange}
                error={!!errors.reasonForVisit}
                helperText={errors.reasonForVisit}
              />
            </Box>
            <Button variant="contained" type="submit" fullWidth sx={{ mt: 3, py: 1.5 }}>
              Save Patient
            </Button>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
};

export default PatientEntryPage;