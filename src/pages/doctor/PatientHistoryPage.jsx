import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  MenuItem,
  IconButton,
  Select,
  Divider,
  Chip,
  RadioGroup,
  Radio,
  FormLabel,
  InputLabel,
  FormControl,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HistoryIcon from '@mui/icons-material/History';
import Swal from 'sweetalert2';
import Layout from '../../utils/Layout';
import PrescriptionPreview from './PrescriptionPreview'; // Update path if needed

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
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [medicines, setMedicines] = useState([{ name: '', dosage: '1 tab', quantity: '', when: { morning: false, afternoon: false, night: false, beforeFood: false, afterFood: false } }]);
  const [complaintNotes, setComplaintNotes] = useState('');
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [bpValue, setBpValue] = useState('');
  const [bpStatus, setBpStatus] = useState('No');
  const [sugarValue, setSugarValue] = useState('');
  const [sugarStatus, setSugarStatus] = useState('No');
  const [weightValue, setWeightValue] = useState('');
  const [weightStatus, setWeightStatus] = useState('No');

  const commonComplaints = [
    "Fever",
    "Headache",
    "Cough",
    "Sore Throat",
    "Fatigue",
    "Nausea",
    "Body Ache",
    "Dizziness",
  ];

  const handleChipClick = (complaint) => {
    let newSelectedComplaints;
    if (selectedComplaints.includes(complaint)) {
      newSelectedComplaints = selectedComplaints.filter(item => item !== complaint);
    } else {
      newSelectedComplaints = [...selectedComplaints, complaint];
    }
    setSelectedComplaints(newSelectedComplaints);
    setComplaintNotes(newSelectedComplaints.join(', '));
  };

  useEffect(() => {
    const idToFetch = patientId ? parseInt(patientId, 10) : 1;
    const foundPatient = mockPatientHistory.find(p => p.id === idToFetch);
    if (foundPatient) {
      setPatient(foundPatient);
    } else {
      setPatient(mockPatientHistory[0]);
    }
  }, [patientId]);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', quantity: '', when: { morning: false, afternoon: false, night: false, beforeFood: false, afterFood: false } }]);
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
    const hasMedicines = medicines.some(med => med.name.trim() !== '' && (med.dosage.trim() !== '' || med.quantity.trim() !== ''));

    if (!hasMedicines) {
        Swal.fire({
            icon: 'error',
            title: 'No Medicines Added',
            text: 'Please add at least one medicine to save the prescription.',
        });
        return;
    }

    const newPrescription = {
      patientName: patient.patientName,
      medicines: medicines,
      complaintNotes: complaintNotes,
      date: new Date().toLocaleDateString(),
      bp: bpStatus === 'Yes' ? bpValue : null,
      sugar: sugarStatus === 'Yes' ? sugarValue : null,
      weight: weightStatus === 'Yes' ? weightValue : null,
    };
    setPrescriptionData(newPrescription);
    setShowPreview(true);
  };

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

        {showPreview ? (
          <PrescriptionPreview data={prescriptionData} onBack={() => {
            setShowPreview(false);
            setMedicines([{ name: '', dosage: '', quantity: '', when: { morning: false, afternoon: false, night: false, beforeFood: false, afterFood: false } }]);
            setComplaintNotes('');
            setSelectedComplaints([]);
            setBpStatus('No');
            setBpValue('');
            setSugarStatus('No');
            setSugarValue('');
            setWeightStatus('No');
            setWeightValue('');
          }} />
        ) : (
          <>
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
                {/* Vitals Section */}
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">Vitals</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <FormLabel>BP</FormLabel>
                      <RadioGroup row value={bpStatus} onChange={(e) => setBpStatus(e.target.value)}>
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                    {bpStatus === 'Yes' && (
                      <TextField
                        fullWidth
                        label="BP Value"
                        value={bpValue}
                        onChange={(e) => setBpValue(e.target.value)}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <FormLabel>Sugar</FormLabel>
                      <RadioGroup row value={sugarStatus} onChange={(e) => setSugarStatus(e.target.value)}>
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                    {sugarStatus === 'Yes' && (
                      <TextField
                        fullWidth
                        label="Sugar Value"
                        value={sugarValue}
                        onChange={(e) => setSugarValue(e.target.value)}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <FormLabel>Weight</FormLabel>
                      <RadioGroup row value={weightStatus} onChange={(e) => setWeightStatus(e.target.value)}>
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                    {weightStatus === 'Yes' && (
                      <TextField
                        fullWidth
                        label="Weight (in kg)"
                        value={weightValue}
                        onChange={(e) => setWeightValue(e.target.value)}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Grid>
                </Grid>

                {/* Complaints Section */}
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">Common Complaints</Typography>
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {commonComplaints.map((complaint, index) => (
                    <Chip
                      key={index}
                      label={complaint}
                      onClick={() => handleChipClick(complaint)}
                      color={selectedComplaints.includes(complaint) ? 'primary' : 'default'}
                      variant={selectedComplaints.includes(complaint) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
                <TextField
                  fullWidth
                  label="Patient Complaint / Notes"
                  multiline
                  rows={3}
                  value={complaintNotes}
                  onChange={(e) => setComplaintNotes(e.target.value)}
                  sx={{ mb: 3 }}
                />

                {/* Medicines Section */}
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">Medicines</Typography>
                {medicines.map((medicine, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          label="Medicine Name"
                          name="name"
                          value={medicine.name}
                          onChange={(e) => handleMedicineChange(index, e)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          name="quantity"
                          value={medicine.quantity}
                          label="Quantity"
                          onChange={(e) => handleMedicineChange(index, e)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <InputLabel>Quantity</InputLabel>
                          <Select
                         

                            label="Daily Dose"
                            name="dosage"
                            value={medicine.dosage}
                            onChange={(e) => handleMedicineChange(index, e)}
                          >
                            <MenuItem value="1 tab">1 tab</MenuItem>
                            <MenuItem value="2 tabs">2 tabs</MenuItem>
                            <MenuItem value="3 tabs">3 tabs</MenuItem>
                          </Select>
                        </FormControl>
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
                  Save and Preview Prescription
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
          </>
        )}
      </Box>
    </Layout>
  );
};

export default PatientHistoryPage;