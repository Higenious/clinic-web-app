import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Layout from "../../utils/Layout";
import { getAllTodayAppointment } from "../../services/service"; // ✅ Your API service

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalId = localStorage.getItem("hospitalId");
        const data = await getAllTodayAppointment(hospitalId); // API should return all appointments for hospital
        setAppointments(data);
      } catch (err) {
        console.error("❌ Failed to fetch appointments", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout selectedPage="appointments" role={role}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          All Appointments
        </Typography>
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Token</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length > 0 ? (
                  appointments.map((appt) => (
                    <TableRow key={appt._id}>
                      <TableCell>{appt.patient?.name}</TableCell>
                      <TableCell>{appt.doctor?.name}</TableCell>
                      <TableCell>
                        {new Date(appt.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(appt.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>{appt.tokenNumber}</TableCell>
                      <TableCell>{appt.reason}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No appointments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Layout>
  );
};

export default AppointmentsPage;
