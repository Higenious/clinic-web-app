import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Helper component for the visual representation of medicine schedule
const TimeCircle = ({ filled }) => (
  <Box
    component="span"
    sx={{
      width: 10,
      height: 10,
      borderRadius: '50%',
      display: 'inline-block',
      backgroundColor: filled ? 'primary.main' : 'transparent',
      border: '1px solid',
      borderColor: 'text.secondary',
      mr: 0.5,
    }}
  />
);

const PrescriptionPreview = ({ data, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, '@media print': { display: 'none' } }}>
        <Button onClick={onBack} startIcon={<ArrowBackIcon />}>
          Back to Form
        </Button>
        <Button onClick={handlePrint} variant="contained" startIcon={<PrintIcon />}>
          Print Prescription
        </Button>
      </Box>

      {/* This is the printable area */}
      <Box id="printable-area">
        {/* Clinic/Hospital Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">Dr. Vitals Clinic</Typography>
          <Typography variant="body1" color="text.secondary">123 Health Street, Wellness City, 12345</Typography>
          <Typography variant="body2" color="text.secondary">Phone: (123) 456-7890 | Email: info@drvitals.com</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Patient and Visit Details */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">Patient Name:</Typography>
            <Typography variant="body1">{data.patientName}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body1" fontWeight="bold">Date:</Typography>
            <Typography variant="body1">{data.date}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              **Complaints:** {data.complaintNotes}
            </Typography>
          </Grid>
        </Grid>

        {/* Vitals Section */}
        {(data.bp || data.sugar || data.weight) && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Vitals</Typography>
            <Grid container spacing={2}>
              {data.bp && (
                <Grid item xs={4}>
                  <Typography variant="body2">BP: {data.bp}</Typography>
                </Grid>
              )}
              {data.sugar && (
                <Grid item xs={4}>
                  <Typography variant="body2">Sugar: {data.sugar}</Typography>
                </Grid>
              )}
              {data.weight && (
                <Grid item xs={4}>
                  <Typography variant="body2">Weight: {data.weight}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
        <Divider sx={{ my: 2 }} />

        {/* Medicines Section with a proper table */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>Prescription</Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table size="small" aria-label="prescription table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Medicine</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Daily Dose</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Time to Take</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>How to Take</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.medicines.map((med, index) => (
                <TableRow key={index}>
                  <TableCell>{med.name}</TableCell>
                  <TableCell>{med.quantity}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {med.when.morning && <Box sx={{ display: 'flex', alignItems: 'center' }}><TimeCircle filled={true} /><Typography variant="caption">Morning</Typography></Box>}
                      {med.when.afternoon && <Box sx={{ display: 'flex', alignItems: 'center' }}><TimeCircle filled={true} /><Typography variant="caption">Afternoon</Typography></Box>}
                      {med.when.night && <Box sx={{ display: 'flex', alignItems: 'center' }}><TimeCircle filled={true} /><Typography variant="caption">Night</Typography></Box>}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {med.when.beforeFood && <Typography variant="body2">Before Food</Typography>}
                      {med.when.afterFood && <Typography variant="body2">After Food</Typography>}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default PrescriptionPreview;