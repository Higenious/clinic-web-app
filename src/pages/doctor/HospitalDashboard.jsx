// src/pages/dashboard/HospitalDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
   Tooltip,
  TableContainer,
  IconButton,
  CircularProgress,
  TableSortLabel,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"; 
import Swal from "sweetalert2";
import {
  cancelAppointment,
  getAllTodayAppointment,
} from "../../services/service";
import Layout from "../../utils/Layout";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [orderBy, setOrderBy] = useState("tokenNumber");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const doctorId = localStorage.getItem("doctorId");
      const hospitalId = localStorage.getItem("hospitalId");

      const data = await getAllTodayAppointment(doctorId, hospitalId);
      const formatted = data.appointments.map((appt) => ({
        id: appt._id,
        tokenNumber: appt.tokenNumber,
        time: new Date(appt.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        patient: appt.patient?.name || "Unknown",
        doctorName: appt.doctor?.name || "Doctor",
        hospital: appt.hospitalId?.name || "Hospital",
        status: appt.status || "Scheduled",
        mobile: appt.patient?.phone || "-",
        visitType: appt.visitType || "General",
        rawData: appt,
      }));

      setAppointments(formatted);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      Swal.fire("Error", "Failed to load appointments.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Delete handler
  const handleDelete = (id, patientName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Cancel appointment for ${patientName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const apiResult = await cancelAppointment(id);
          if (apiResult.appointment.status === "cancelled") {
            Swal.fire("Cancelled!", "Appointment has been cancelled.", "success");
            await fetchAppointments();
          }
        } catch (error) {
          console.log(error);
          Swal.fire("Error", "Failed to cancel appointment.", "error");
        }
      }
    });
  };

  const handleView = (payload) => {
    setSelectedPatient(payload);
    setOpen(true);
  };

  const handleCheckUp = (payload) => {
    localStorage.setItem("selectedAppointment", JSON.stringify(payload));
    navigate(`/prescription/${payload.id}`);
  };

  // Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...appointments].sort((a, b) => {
    const valA = a[orderBy];
    const valB = b[orderBy];
    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // CSV Download
  const handleDownloadCSV = () => {
    const headers = [
      "Token No,Time,Patient,Doctor,Mobile,Visit Type,Status",
    ];
    const rows = appointments.map(
      (appt) =>
        `${appt.tokenNumber},${appt.time},${appt.patient},${appt.doctorName},${appt.mobile},${appt.visitType},${appt.status}`
    );
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "appointments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout selectedPage="hospital">
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a237e" }}>
            🏥 Today's Appointments
          </Typography>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCSV}
            sx={{
              backgroundColor: "#1976d2",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Download CSV
          </Button>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: "0px 6px 18px rgba(0,0,0,0.1)" }}>
          <CardContent>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
<TableContainer>
  <Table sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
<TableHead sx={{ backgroundColor: "#1976d2" }}>
  <TableRow>
    {[
      { id: "tokenNumber", label: "Token" },
      { id: "time", label: "Time" },
      { id: "patient", label: "Patient" },
      { id: "doctorName", label: "Doctor" },
      { id: "mobile", label: "Mobile" },
      { id: "visitType", label: "Visit Type" },
      { id: "status", label: "Status" },
    ].map((col) => (
      <TableCell
        key={col.id}
        sx={{
          color: "white",
          fontWeight: 700, // Increased boldness
          fontSize: "0.95rem", // Slightly larger if needed
        }}
      >
        <TableSortLabel
          active={orderBy === col.id}
          direction={orderBy === col.id ? order : "asc"}
          onClick={() => handleSort(col.id)}
          sx={{
            color: "white",
            fontWeight: 700,
            "& .MuiTableSortLabel-icon": { color: "white !important" },
          }}
        >
          {col.label}
        </TableSortLabel>
      </TableCell>
    ))}
    <TableCell
      align="center"
      sx={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}
    >
      Actions
    </TableCell>
  </TableRow>
</TableHead>


    <TableBody>
      {paginatedData.length > 0 ? (
        paginatedData.map((appt, index) => (
          <motion.tr
            key={appt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
            style={{ cursor: "pointer" }}
          >
            <TableCell>{appt.tokenNumber}</TableCell>
            <TableCell>{appt.time}</TableCell>
            <TableCell>{appt.patient}</TableCell>
            <TableCell>{appt.doctorName}</TableCell>
            <TableCell>{appt.mobile}</TableCell>
            <TableCell>{appt.visitType}</TableCell>
            <TableCell>
              <span
                style={{
                  color:
                    appt.status === "cancelled"
                      ? "red"
                      : appt.status === "completed"
                      ? "green"
                      : "#1976d2",
                  fontWeight: 600,
                }}
              >
                {appt.status}
              </span>
            </TableCell>
            <TableCell align="center">
               <Tooltip title="View Details">
              <IconButton color="primary" onClick={() => handleView(appt)}>
                <VisibilityIcon />
              </IconButton>
              </Tooltip>
                <Tooltip title="Check Up / Edit">
              <IconButton color="secondary" onClick={() => handleCheckUp(appt)}>
                <EditIcon />
              </IconButton>
              </Tooltip>
               <Tooltip title="Cancel Appointment">
              <IconButton
                color="error"
                onClick={() => handleDelete(appt.id, appt.patient)}
                disabled={["cancelled", "completed"].includes(appt.status)}
              >
                <DeleteIcon />
              </IconButton>
              </Tooltip>
            </TableCell>
          </motion.tr>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={8} align="center">
            No appointments today.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>



            )}

            {/* Pagination */}
            <TablePagination
              component="div"
              count={appointments.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 8, 10, 25]}
            />
          </CardContent>
        </Card>
      </Box>
      {/* Patient Details Modal */}
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
      background: "linear-gradient(135deg, #ffffff 0%, #f3f7ff 100%)",
      overflow: "hidden",
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: "#82b2e2ff",
      color: "white",
      fontWeight: 600,
      fontSize: "1.25rem",
      textAlign: "center",
      py: 2,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    }}
  >
    🧑‍⚕️ Patient Details
  </DialogTitle>

  <DialogContent
    sx={{
      mt: 2,
      px: 4,
      py: 2,
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
    }}
  >
    {selectedPatient ? (
      <>
        <Typography variant="h6" textAlign="center" fontWeight={700} mb={2}>
          {selectedPatient.patient}
        </Typography>
        <Typography><strong>Doctor:</strong> {selectedPatient.doctorName}</Typography>
        <Typography><strong>Hospital:</strong> {selectedPatient.hospital}</Typography>
        <Typography><strong>Mobile:</strong> {selectedPatient.mobile}</Typography>
        <Typography><strong>Visit Type:</strong> {selectedPatient.visitType}</Typography>
        <Typography><strong>Status:</strong> 
          <span style={{color: selectedPatient.status === "cancelled" ? "red" : selectedPatient.status === "completed" ? "green" : "#1976d2", fontWeight: 600}}>
            {selectedPatient.status}
          </span>
        </Typography>
      </>
    ) : (
      <Typography>No patient details found.</Typography>
    )}
  </DialogContent>

  <Box display="flex" justifyContent="center" pb={2}>
    <Button
      onClick={() => setOpen(false)}
      variant="contained"
      sx={{ backgroundColor: "#1976d2", borderRadius: "8px", px: 4, fontWeight: 600, textTransform: "none" }}
    >
      Close
    </Button>
  </Box>
</Dialog>

    </Layout>
  );
};

export default HospitalDashboard;
