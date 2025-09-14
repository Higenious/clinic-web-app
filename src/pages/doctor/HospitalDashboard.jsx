import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import Layout from "../../utils/Layout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// Mock data with unique IDs
const mockAppointments = [
  { id: 1, time: '10:00 AM', patient: 'John Doe', doctorName: 'Dr. Smith', location: 'Room 2', mobile: '123-456-7890', visitType: 'New' },
  { id: 2, time: '10:30 AM', patient: 'Jane Doe', doctorName: 'Dr. Smith', location: 'Room 2', mobile: '098-765-4321', visitType: 'Follow-up' },
  { id: 3, time: '11:00 AM', patient: 'Peter Jones', doctorName: 'Dr. Williams', location: 'Room 3', mobile: '111-222-3333', visitType: 'Consultation' },
  { id: 4, time: '10:30 AM', patient: 'Jane Doe', doctorName: 'Dr. Smith', location: 'Room 2', mobile: '098-765-4321', visitType: 'Follow-up' },
  { id: 5, time: '11:00 AM', patient: 'Peter Jones', doctorName: 'Dr. Williams', location: 'Room 3', mobile: '111-222-3333', visitType: 'Consultation' },
  { id: 6, time: '10:30 AM', patient: 'Jane Doe', doctorName: 'Dr. Smith', location: 'Room 2', mobile: '098-765-4321', visitType: 'Follow-up' },
  { id: 7, time: '11:00 AM', patient: 'Peter Jones', doctorName: 'Dr. Williams', location: 'Room 3', mobile: '111-222-3333', visitType: 'Consultation' },
];

const getAllTodayAppointment = async () => {
  return mockAppointments;
};

const HospitalDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllTodayAppointment();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleDelete = (appointmentId, patientName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to cancel the appointment for ${patientName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would call your API to delete the appointment
        console.log(`Deleting appointment with ID: ${appointmentId}`);
        // For demonstration, we'll filter the state
        const updatedAppointments = appointments.filter(
          (appt) => appt.id !== appointmentId
        );
        setAppointments(updatedAppointments);
        Swal.fire({
          title: "Cancelled!",
          text: "The appointment has been cancelled.",
          icon: "success"
        });
      }
    });
  };

  const handleViewOrEdit = (patientId) => {
    // Navigate to the patient history page, passing the patient's ID
    // The PatientHistoryPage would then use this ID to fetch the correct data
    navigate(`/patient-history/${patientId}`);
  };

  return (
    <Layout selectedPage="hospital">
      <Box p={3}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, color: "#1976d2" }}>
          <MedicalServicesIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            {getGreeting()}, Doctor 👋
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, color: "#424242" }}>
          Your appointments for today:
        </Typography>

        <Box sx={{ overflowX: 'auto' }}>
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="today's appointments table">
            <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor's Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Visit Type</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <TableRow
                    key={appt.id} // Use the unique ID as the key
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" },
                      "&:hover": { backgroundColor: "#e0e0e0", transition: "0.2s" },
                    }}
                  >
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.patient}</TableCell>
                    <TableCell>{appt.doctorName}</TableCell>
                    <TableCell>{appt.location}</TableCell>
                    <TableCell>{appt.mobile}</TableCell>
                    <TableCell>{appt.visitType}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary" 
                        size="small" 
                        aria-label="view"
                        onClick={() => handleViewOrEdit(appt.id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="info" 
                        size="small" 
                        aria-label="edit"
                        onClick={() => handleViewOrEdit(appt.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small" 
                        aria-label="delete"
                        onClick={() => handleDelete(appt.id, appt.patient)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No appointments for today.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      </Box>
    </Layout>
  );
};

export default HospitalDashboard;