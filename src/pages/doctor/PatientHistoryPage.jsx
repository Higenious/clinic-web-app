import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from 'react-router-dom'; 
import HistoryIcon from "@mui/icons-material/History";
import Swal from "sweetalert2";
import cureLinkLogoImage from '../../public/Logo/cureLink_Logo.png';
// Assuming these utility components and services exist in your project structure
import Layout from "../../utils/Layout";
import AddPrescription from "./AddPrescription";
import PrescriptionPreview from "../common/PrescriptionPreview";
import { finzalizeAppointment, getAllCommonMedicines } from "../../services/service";
import doctorLogoImage from '../../public/Logo/doctor_logo3.jpeg';



const cureLinkLogoData = {
    text: "cureLink",
    url: cureLinkLogoImage, // Use the imported variable
}

const PatientHistoryPage = () => {
   const navigate = useNavigate();
  const storedData = localStorage.getItem("selectedAppointment");
  const appointment = storedData ? JSON.parse(storedData) : null;
  const doctorId = localStorage.getItem("doctorId");
  
  const [adviceNotes, setAdviceNotes] = useState("");
  const [patient, setPatient] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null); // Holds data prepared for preview

  const [medicines, setMedicines] = useState([{ name: "", dosage: "1 tab", quantity: "", when: {} }]);
  const [commonMedicines, setCommonMedicines] = useState([]);
  const [complaintNotes, setComplaintNotes] = useState("");
  const [selectedComplaints, setSelectedComplaints] = useState([]);

  const [bpValue, setBpValue] = useState("");
  const [sugarValue, setSugarValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  
  // Initializing status to 'no' for conditional inputs to work correctly
  const [bpStatus, setBpStatus] = useState("no"); 
  const [sugarStatus, setSugarStatus] = useState("no");
  const [weightStatus, setWeightStatus] = useState("no");

  const commonComplaints = [
    "Fever", "Headache", "Cough", "Sore Throat",
    "Fatigue", "Nausea", "Body Ache", "Dizziness",
  ];


  // Dummy Doctor Info for the Preview Header (Replace with actual data fetch if available)
const doctorInfo = {
    name: appointment?.doctorName || appointment?.rawData?.doctor?.name || "Dr. Default Name",
    specialization: "General Physician",
    registration: "GMC-12345",
    address: "101 Clinic Building, City Center, 444601",
    phone: "+91 98765 43210",
    logoUrl: doctorLogoImage
};
  // Safely access patient and prescriptions data
  const patientData = appointment?.rawData?.patient || {};
  const prescriptions = patientData.prescriptions || [];

  // --- Fetch Common Medicines ---
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCommonMedicines(); 
        const meds = Array.isArray(res.data) ? res.data : [];
        setCommonMedicines(meds); 
      } catch (error) {
        console.error("Error fetching common medicines:", error);
        setCommonMedicines([]);
      }
    })();
  }, []);

  // --- Map Patient History ---
  useEffect(() => {
    if (!appointment) return;
    const visitHistory = prescriptions.map((pres) => ({
      visitDate: new Date(pres.createdAt).toLocaleDateString(),
      treatedBy: "Dr. Jane Smith", // Dummy data
      reasonForVisit: appointment.reason || "General consultation",
      bp: pres.bp || "N/A",
      adviceGiven: pres.instructions?.join(", ") || "No advice provided.",
      medicines: pres.medications.map((m) => ({
        name: m.medicine,
        dosage: `${m.quantity} tabs`,
        when: m.dailyDose, // This is likely in '1-0-1' format
      })),
    }));

    setPatient({
      patientName: patientData.name,
      mobile: patientData.phone,
      visits: visitHistory,
    });
  }, []); // Dependency array for useEffect

  // --- Handlers for Medicine Inputs ---
  const handleAddMedicine = () => setMedicines([...medicines, { name: "", dosage: "1 tab", quantity: "", when: {} }]);
  const handleRemoveMedicine = (i) => setMedicines(medicines.filter((_, idx) => idx !== i));

  const handleMedicineChange = (i, e) => {
    const { name, value, type, checked } = e.target;
    const updated = [...medicines];
    if (type === "checkbox") {
      updated[i].when[name] = checked;
    } else if (name === "meal") {
      updated[i].when.meal = value;
    } else {
      updated[i][name] = value;
    }
    setMedicines(updated);
  };

  const handleChipClick = (complaint) => {
    setSelectedComplaints((prev) =>
      prev.includes(complaint)
        ? prev.filter((c) => c !== complaint)
        : [...prev, complaint]
    );
  };
  
  // --- UPDATED: PREVIEW BUTTON HANDLER ---
const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (!appointment?.id) return Swal.fire("Error", "Invalid appointment", "error");

    const hasMedicines = medicines.some((m) => m.name.trim());
    if (!hasMedicines) return Swal.fire("Error", "Please add at least one medicine", "error");
    
    const finalBpValue = bpStatus === 'yes' ? bpValue : '';
    const finalSugarValue = sugarStatus === 'yes' ? sugarValue : '';
    const finalWeightValue = weightStatus === 'yes' ? weightValue : '';

    const newPrescriptionData = {
        date: new Date().toLocaleDateString(),
        doctor: doctorInfo, // 💡 Contains name and logoUrl now
        complaintNotes,
        selectedComplaints,
        // 💡 NEW FIELD: Advice Notes
        adviceNotes, 
        vitals: {
            bpValue: finalBpValue,
            sugarValue: finalSugarValue,
            weightValue: finalWeightValue,
        },
        medicines: medicines.filter(m => m.name.trim()).map((m) => {
            const dailyDose = `${m.when.morning ? 1 : 0}-${m.when.afternoon ? 1 : 0}-${m.when.night ? 1 : 0}`;
            const mealTiming = m.when.meal || "after";
            
            const doseTimingText = [
                m.when.morning && 'M',
                m.when.afternoon && 'A',
                m.when.night && 'N'
            ].filter(Boolean).join('-') || 'N/A';

            return {
                name: m.name,
                quantity: m.quantity,
                dosage: m.dosage, 
                dailyDose: dailyDose, 
                mealTiming: mealTiming, 
                previewDose: `${doseTimingText} (${mealTiming === 'before' ? 'Before Food' : 'After Food'})`
            };
        }),
    };

    setPrescriptionData(newPrescriptionData);
    setShowPreview(true);
  };


  // --- NEW: SAVE BUTTON HANDLER (Hits the API) ---
  const handleFinalizePrescription = async () => {
    if (!appointment?.id || !prescriptionData) return Swal.fire("Error", "No prescription data to save.", "error");

    // The data is already prepared in prescriptionData, format for API payload
    const apiPayload = {
        doctorId,
        prescriptions: prescriptionData.medicines.map((m) => ({
            medicine: m.name,
            quantity: parseInt(m.quantity) || 1,
            dailyDose: m.dailyDose, 
            mealTiming: m.mealTiming,
        })),
        complaints: [prescriptionData.complaintNotes, ...prescriptionData.selectedComplaints], // Include selected chips in complaints
        bp: prescriptionData.vitals.bpValue,
        sugar: prescriptionData.vitals.sugarValue,
        weight: prescriptionData.vitals.weightValue,
        adviceGiven: [prescriptionData?.adviceNotes]
    };

    try {
      const result = await finzalizeAppointment(appointment.id, apiPayload);
      console.log('result finalize = = = >', result);
      if (result.status == 'ok') {
        Swal.fire("Saved!", "Prescription finalized successfully!", "success");
         localStorage.removeItem("selectedAppointment");
        // Clear state and refresh or navigate away after saving
        setShowPreview(false); 
          setTimeout(() => {
        navigate(`/hospital`);
      }, 2000);
        // Logic to refresh patient history data should go here
      } else {
         Swal.fire("Error", result.message || "Could not save prescription due to an API error.", "error");
      }
    } catch (error) {
      console.error('errror wile finalize- - - ->', error);
      Swal.fire('Error', error, 'error');
    }
  };


  if (!patient)
    return (
      <Layout selectedPage="patient-history">
        <Box p={4}>
          <Typography>Loading patient history...</Typography>
        </Box>
      </Layout>
    );

  return (
    <Layout selectedPage="patient-history">
      <Box p={3}>
        <Box display="flex" alignItems="center" mb={2} color="#1976d2">
          <HistoryIcon sx={{ mr: 1, fontSize: 32 }} />
              <Typography variant="h6" fontWeight="bold" color="primary">
               Prescription for {patient.patientName}
          </Typography>
        </Box>

        {showPreview ? (
          <PrescriptionPreview 
            data={prescriptionData} 
            onBack={() => setShowPreview(false)} 
            onSave={handleFinalizePrescription} // Passes the new save function
            cureLinkLogo={cureLinkLogoData} 
          />
        ) : (
          <>
            <AddPrescription
              {...{
                medicines,
                handleAddMedicine,
                handleRemoveMedicine,
                handleMedicineChange,
                bpValue,
                setBpValue,
                sugarValue,
                setSugarValue,
                weightValue,
                setWeightValue,
                bpStatus,
                setBpStatus,
                sugarStatus,
                setSugarStatus,
                weightStatus,
                setWeightStatus,
                complaintNotes,
                setComplaintNotes,
                setMedicines,
                commonComplaints,
                selectedComplaints,
                handleChipClick,
                handlePrescriptionSubmit, // Triggers PREVIEW
                commonMedicines,
                adviceNotes,
                setAdviceNotes,
              }}
            />

            {/* --- Past Visit History --- */}
            <Accordion 
              defaultExpanded={false}
              sx={{ 
                border: '1px solid #ddd', 
                borderRadius: 2, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                mt: 4
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  backgroundColor: '#f8fafd', 
                  borderBottom: '1px solid #eee', 
                  borderRadius: '2px 2px 0 0',
                }}
              >
                <Typography variant="h6" color="text.primary">
                  <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> 
                  Past Visit History
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {patient.visits.length === 0 ? (
                  <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    No previous visits found (First visit).
                  </Typography>
                ) : (
                  patient.visits.map((v, i) => (
                    <Paper 
                      key={i} 
                      sx={{ 
                        p: 3, 
                        mb: 3, 
                        backgroundColor: "#f9f9f9", 
                        borderLeft: '4px solid #1976d2', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                        transition: 'box-shadow 0.3s',
                        '&:hover': { boxShadow: '0 4px 15px rgba(0,0,0,0.15)' } 
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle1" fontWeight="bold" color="primary">
                              Visit on {v.visitDate}
                          </Typography>
                          <Chip 
                            label={`By ${v.treatedBy}`} 
                            size="small" 
                            color="default" 
                            variant="outlined" 
                          />
                      </Box>
                      <Typography variant="body2" color="text.secondary">Reason: {v.reasonForVisit}</Typography>
                      <Typography variant="body2" color="text.secondary">BP: **{v.bp}**</Typography>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography fontWeight="bold" sx={{mb: 0.5}}>Advice:</Typography>
                      <Typography variant="body2" sx={{ ml: 1, fontStyle: 'italic' }}>
                        {v.adviceGiven}
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography fontWeight="bold" sx={{mb: 0.5}}>Medicines:</Typography>
                      {v.medicines.map((m, j) => (
                        <Box key={j} display="flex" alignItems="center" sx={{ ml: 1, mb: 0.5 }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>• **{m.name}**</Typography>
                          <Chip label={`${m.dosage} (${m.when})`} size="small" color="success" variant="outlined" />
                        </Box>
                      ))}
                    </Paper>
                  ))
                )}
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default PatientHistoryPage;