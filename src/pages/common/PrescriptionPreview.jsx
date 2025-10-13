// PrescriptionPreview.js

import React, { useRef } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Grid, 
    Divider, 
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PrescriptionPreview = ({ data, onBack, onSave, cureLinkLogo }) => { 
    const printRef = useRef();

    if (!data) return <Typography>No prescription data to preview.</Typography>;

    const handlePrint = () => {
        // Simple print command for the whole document/page
        window.print(); 
    };

    const { doctor, date, vitals, complaintNotes, selectedComplaints, medicines, adviceNotes } = data; // 💡 Destructure adviceNotes

    return (
        <Box>
            {/* 💡 5) Hide buttons and navigation bar during print */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2, '@media print': { display: 'none' } }}>
                <Button 
                    variant="outlined" 
                    onClick={onBack} 
                    startIcon={<ArrowBackIcon />}
                >
                    Edit Prescription
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handlePrint} 
                    startIcon={<PrintIcon />}
                >
                    Print Prescription
                </Button>
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={onSave} 
                    startIcon={<SaveIcon />}
                >
                    Save & Finalize
                </Button>
            </Box>

            {/* Prescription Content (The printable area) */}
            <Paper elevation={4} sx={{ p: 4 }} ref={printRef}>
                
                {/* 1. Header: Doctor Info and Logo */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3, borderBottom: '3px solid #1976d2', pb: 2 }}>
                    <Grid item xs={10}>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            {doctor.name} {/* 💡 Doctor name fixed here */}
                        </Typography>
                        <Typography variant="subtitle1">{doctor.specialization} | Reg: {doctor.registration}</Typography>
                        <Typography variant="body2">{doctor.address} | {doctor.phone}</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: 'right' }}>
                        {/* 🌟 Doctor Logo (Primary) - Using imported URL */}
                        <Box sx={{ width: 80, height: 80, display: 'inline-block' }}>
                            {doctor.logoUrl && (
                                <img 
                                    src={doctor.logoUrl} 
                                    alt="Doctor Logo" 
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right', mt: -2 }}>
                        <Typography variant="body2" fontWeight="bold">Date: {date}</Typography>
                    </Grid>
                </Grid>

                {/* 2. Patient & Vitals */}
                <Typography variant="h6" gutterBottom>Patient Vitals & Complaints</Typography>
                {/* ... (Vitals/Complaints Box) ... */}
                 <Box sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="body1">**BP:** {vitals.bpValue || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body1">**Sugar:** {vitals.sugarValue || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body1">**Weight:** {vitals.weightValue || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1" fontWeight="bold">Complaints:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {selectedComplaints.map(c => <Chip key={c} label={c} size="small" variant="outlined" />)}
                        {complaintNotes && <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 1 }}>Notes: {complaintNotes}</Typography>}
                    </Box>
                </Box>
                
                {/* 3. Medicines */}
                <Typography variant="h6" sx={{ mb: 2 }}>Rx - Medications</Typography>
                {/* ... (Medicine Table) ... */}
                <TableContainer component={Paper} elevation={1}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Medicine</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '100px', textAlign: 'center' }}>Qty</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '250px' }}>Dosage & Timing</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {medicines.map((m, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Typography fontWeight="bold" color="success.dark">
                                            {m.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        {m.quantity}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {m.dosage}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {m.previewDose} 
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* 4. Advice and Footer */}
                <Box sx={{ mt: 4, pt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    
                    {/* 💡 NEW: Advice Section */}
                    <Box sx={{ borderBottom: '1px solid #ccc', pb: 1, mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                            Advice:
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1, whiteSpace: 'pre-line' }}>
                            {adviceNotes || 'No specific advice given.'}
                        </Typography>
                    </Box>

                    {/* Follow-up Section */}
                    <Box sx={{ borderBottom: '1px solid #ccc', pb: 1, mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Follow-up: Visit after <span style={{ textDecoration: 'underline', padding: '0 30px' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> days.
                        </Typography>
                    </Box>

                    {/* CureLink Branding & Signature */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        {/* CureLink Branding (Secondary/Software Branding) */}
                        {cureLinkLogo && (
                            <Box sx={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <img 
                                    src={cureLinkLogo.url} 
                                    alt={cureLinkLogo.text} 
                                    style={{ height: 20 }} 
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Powered by {cureLinkLogo.text}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2" fontWeight="bold">Doctor's Signature</Typography>
                            <Typography variant="body2">Thank you for visiting.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default PrescriptionPreview;