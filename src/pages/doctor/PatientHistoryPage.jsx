import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import {
  Box,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HistoryIcon from '@mui/icons-material/History';
import Swal from 'sweetalert2';
import Layout from '../../utils/Layout';

// Mock data for patient history
const mockPatientHistory = [
  {
    id: 1,
    patientName: 'John Doe',
    visits: [
      {
        id: 101,
        visitDate: '2025-09-10',
        treatedBy: 'Dr. Jane Smith',
        reasonForVisit: 'Routine check-up',
        bp: '120/80 mmHg',
        adviceGiven: 'Maintain a healthy diet and exercise regimen.',
        medicines: [
          { name: 'Multivitamin', dosage: '1 tablet', when: 'Once a day, morning' },
          { name: 'Calcium', dosage: '500 mg', when: 'Once a day, afternoon' },
        ],
      },
    ],
  },
  {
    id: 2,
    patientName: 'Jane Doe',
    visits: [
      {
        id: 201,
        visitDate: '2025-08-15',
        treatedBy: 'Dr. Robert Johnson',
        reasonForVisit: 'High fever and cough',
        bp: '130/85 mmHg',
        adviceGiven: 'Get plenty of rest and stay hydrated.',
        medicines: [
          { name: 'Amoxicillin', dosage: '500 mg', when: '3 times a day' },
          { name: 'Ibuprofen', dosage: '200 mg', when: 'Every 4 hours as needed' },
        ],
      },
    ],
  },
];

const PatientHistoryPage = () => {
  const { patientId } = useParams(); // Get patientId from URL parameters
  const [patient, setPatient] = useState(null); // State to store the patient data
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', when: { morning: false, afternoon: false, night: false, beforeFood: false, afterFood: false } }]);

  // Effect to fetch patient data based on ID
  useEffect(() => {
    // Convert URL param to a number, with a default of 1 if not provided
    const idToFetch = patientId ? parseInt(patientId, 10) : 1; 
    console.log('patientId=======>', patientId);
    const foundPatient = mockPatientHistory.find(p => p.id === idToFetch);

    if (foundPatient) {
      setPatient(foundPatient);
    } else {
      // Handle case where no patient is found (e.g., show an error or default to a patient)
      setPatient(mockPatientHistory[0]);
    }
  }, [patientId]); // Rerun this effect when the URL changes

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', when: { morning: false, afternoon: false, night: false, beforeFood: false, afterFood: false } }]);
  };

  const handleRemoveMedicine = (index) => {
    const newMedicines = [...medicines];
    newMedicines.splice(index, 1);
    setMedicines(newMedicines);
  };

  const handleMedicineChange = (index, event) => {
    const { name, value, checked, type } = event.target;
    const newMedicines = [...medicines];
    if (type === 'checkbox') {
      newMedicines[index].when[name] = checked;
    } else {
      newMedicines[index][name] = value;
    }
    setMedicines(newMedicines);
  };

  const handlePrescriptionSubmit = (event) => {
    event.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Prescription Added!',
      text: 'New medicine information has been saved successfully.',
      timer: 2000,
      showConfirmButton: false,
    });
    setMedicines([{ name: '', dosage: '', when: { morning: false, afternoon: false, night: false, beforeFood: false, afterFood: false } }]);
  };

  // Render nothing or a loading spinner until patient data is loaded
  if (!patient) {
    return <Typography>Loading patient data...</Typography>;
  }

  return (
    <Layout selectedPage="patient-history">
      <Box p={3}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, color: "#1976d2" }}>
          <HistoryIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            {patient.patientName}'s History
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Add New Prescription</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddMedicine}
              sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
            >
              Add Medicine
            </Button>
          </Box>
          
          <form onSubmit={handlePrescriptionSubmit}>
            {medicines.map((medicine, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Medicine Name"
                      name="name"
                      value={medicine.name}
                      onChange={(e) => handleMedicineChange(index, e)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Dosage"
                      name="dosage"
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, e)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton color="error" onClick={() => handleRemoveMedicine(index)}>
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>When to Take:</Typography>
                  <Grid container spacing={1}>
                    <Grid item>
                      <FormControlLabel
                        control={<Checkbox name="morning" checked={medicine.when.morning} onChange={(e) => handleMedicineChange(index, e)} />}
                        label="Morning"
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={<Checkbox name="afternoon" checked={medicine.when.afternoon} onChange={(e) => handleMedicineChange(index, e)} />}
                        label="Afternoon"
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={<Checkbox name="night" checked={medicine.when.night} onChange={(e) => handleMedicineChange(index, e)} />}
                        label="Night"
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={<Checkbox name="beforeFood" checked={medicine.when.beforeFood} onChange={(e) => handleMedicineChange(index, e)} />}
                        label="Before Food"
                      />
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={<Checkbox name="afterFood" checked={medicine.when.afterFood} onChange={(e) => handleMedicineChange(index, e)} />}
                        label="After Food"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            ))}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Save Prescription
            </Button>
          </form>
        </Paper>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Past Visit History</Typography>
          {patient.visits.map((visit) => (
            <Accordion key={visit.id} sx={{ mb: 2 }} elevation={2}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1" fontWeight="bold">
                  Visit on {visit.visitDate}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Treated By:</strong> {visit.treatedBy}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Reason for Visit:</strong> {visit.reasonForVisit}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>BP:</strong> {visit.bp}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Advice Given:</strong> {visit.adviceGiven}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                    Prescribed Medicines:
                  </Typography>
                  <Grid container spacing={1}>
                    {visit.medicines.map((med, medIndex) => (
                      <Grid item xs={12} key={medIndex}>
                        <Paper sx={{ p: 1, backgroundColor: '#e3f2fd' }}>
                          <Typography variant="body2">
                            <strong>{med.name}:</strong> {med.dosage} ({med.when})
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default PatientHistoryPage;