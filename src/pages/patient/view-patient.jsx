import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import Layout from '../../utils/Layout';

const ViewPatientPage = () => {
  // Example static data (replace with API call)
  const patients = [
    { id: 1, name: 'Rahul Sharma', age: 32, gender: 'Male', contact: '9876543210' },
    { id: 2, name: 'Priya Singh', age: 27, gender: 'Female', contact: '9876500000' },
  ];

  const role = localStorage.getItem('role');

  return (
    <Layout selectedPage="patient-history" role={role}>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', mb: 2, color: '#1976d2' }}>
          <HistoryIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Patient History
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Age</b></TableCell>
                <TableCell><b>Gender</b></TableCell>
                <TableCell><b>Contact</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell>{p.gender}</TableCell>
                  <TableCell>{p.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ViewPatientPage;
