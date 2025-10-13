import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Autocomplete,
  Tooltip, 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { styled } from "@mui/material/styles"; 
import { keyframes } from '@emotion/react';

// Define a subtle hover animation for Autocomplete options
const shake = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.01); }
  100% { transform: scale(1); }
`;

// Styled Autocomplete to apply better hover style for menu items
const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  // Targeting the listbox for better hover
  '& .MuiAutocomplete-listbox': {
    '& .MuiAutocomplete-option': {
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: theme.palette.action.hover, // Use theme's hover color
        color: theme.palette.text.primary,
        animation: `${shake} 0.3s ease-in-out`, // Apply subtle animation on hover
      },
    },
  },
  // Setting a minimum width for the Autocomplete component
  minWidth: 200, 
}));


// Component for the conditional Vitals input (UNCHANGED)
const VitalsInput = ({ label, value, setValue, status, setStatus, helperText }) => (
  <Grid item xs={12} sm={4}>
    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>{label} Recorded?</Typography>
    <RadioGroup
      row
      value={status}
      onChange={(e) => {
        setStatus(e.target.value);
        if (e.target.value === 'no') {
          setValue(''); // Clear value when toggling to 'no'
        }
      }}
      sx={{ mb: 1 }}
    >
      <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
      <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
    </RadioGroup>
    
    {/* Conditional rendering: show TextField only if status is 'yes' */}
    {status === 'yes' && (
      <TextField
        fullWidth
        label={`Enter ${label}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        helperText={helperText}
      />
    )}
  </Grid>
);


const AddPrescription = ({
  medicines,
  setMedicines,
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
  commonComplaints,
  selectedComplaints,
  handleChipClick,
  handlePrescriptionSubmit,
  commonMedicines
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>

      {/* 🔹 Vitals (UNCHANGED) */}
      <Grid container spacing={4} sx={{ mb: 3 }}>
        <VitalsInput
          label="Blood Pressure"
          value={bpValue}
          setValue={setBpValue}
          status={bpStatus}
          setStatus={setBpStatus}
          helperText="Example: 120/80 mmHg"
        />
        <VitalsInput
          label="Sugar Level"
          value={sugarValue}
          setValue={setSugarValue}
          status={sugarStatus}
          setStatus={setSugarStatus}
          helperText="Example: 90 mg/dl"
        />
        <VitalsInput
          label="Weight"
          value={weightValue}
          setValue={setWeightValue}
          status={weightStatus}
          setStatus={setWeightStatus}
          helperText="Example: 70 kg"
        />
      </Grid>
      
      {/* 🔹 Complaints (UNCHANGED) */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Patient Complaints
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {commonComplaints.map((c) => (
          <Button
            key={c}
            variant={selectedComplaints.includes(c) ? "contained" : "outlined"}
            size="small"
            onClick={() => handleChipClick(c)}
            sx={{
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' } // Subtle lift on hover
            }}
          >
            {c}
          </Button>
        ))}
      </Box>

      <TextField
        fullWidth
        label="Complaint Notes"
        multiline
        rows={3}
        value={complaintNotes}
        onChange={(e) => setComplaintNotes(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* 🔹 Medicines */}
      <Typography variant="subtitle1" fontWeight="bold">
        Medicines
      </Typography>
      {medicines.map((m, i) => (
        <Box
          key={i}
          sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 2, boxShadow: 1 }} // Added subtle shadow
        >
          <Grid container spacing={2} alignItems="flex-start">
            
            {/* 1. Medicine Name Autocomplete - Keeping width sm={6} to match the original width */}
            <Grid item xs={12} sm={9}> 
              <StyledAutocomplete 
                freeSolo
                fullWidth
                options={commonMedicines || []}
                filterOptions={(options, state) =>
                  options.filter((opt) =>
                    opt.toLowerCase().includes(state.inputValue.toLowerCase())
                  )
                }
                value={m.name}
                onInputChange={(event, newValue) => {
                  const updated = [...medicines];
                  updated[i].name = newValue;
                  setMedicines(updated);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select or Type Medicine Name" 
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>

            {/* 2. Quantity - Width adjusted */}
            <Grid item xs={4} sm={1}>
              {/* This TextField will now adopt the default height, matching the Autocomplete and Dosage Select */}
              <TextField 
                fullWidth
                label="Qty"
                name="quantity"
                type="number" 
                value={m.quantity}
                onChange={(e) => handleMedicineChange(i, e)}
                inputProps={{ style: { textAlign: 'center' } }}
              />
            </Grid>

            {/* 3. Dosage - Width adjusted. FIX: Removed size="small" from FormControl */}
            <Grid item xs={6} sm={1}> 
              <FormControl fullWidth> 
                <InputLabel>Dosage</InputLabel>
                <Select
                  name="dosage"
                  value={m.dosage}
                  onChange={(e) => handleMedicineChange(i, e)}
                  label="Dosage"
                >
                  <MenuItem value="1 tab">1 tab</MenuItem>
                  <MenuItem value="2 tabs">2 tabs</MenuItem>
                  <MenuItem value="3 tabs">3 tabs</MenuItem>
                  <MenuItem value="1 ml">1 ml</MenuItem>
                  <MenuItem value="2 ml">2 ml</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 4. Remove Button - Width adjusted */}
            <Grid item xs={2} sm={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Tooltip title="Remove Medicine">
                {/* Vertically centering the icon to align with the inputs */}
                <IconButton color="error" onClick={() => handleRemoveMedicine(i)} size="large"> 
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>


          {/* 5. Timing Options (UNCHANGED) */}
          <Grid container spacing={4} sx={{ mt: 1, borderTop: '1px dashed #eee', pt: 2 }}>
            
            {/* When to Take */}
            <Grid item xs={12} sm={7}>
              <Typography variant="body2" fontWeight="bold" color="primary">
                When to Take:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="morning"
                      checked={m.when.morning || false}
                      onChange={(e) => handleMedicineChange(i, e)}
                      size="small"
                    />
                  }
                  label="Morning"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="afternoon"
                      checked={m.when.afternoon || false}
                      onChange={(e) => handleMedicineChange(i, e)}
                      size="small"
                    />
                  }
                  label="Afternoon"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="night"
                      checked={m.when.night || false}
                      onChange={(e) => handleMedicineChange(i, e)}
                      size="small"
                    />
                  }
                  label="Night"
                />
              </Box>
            </Grid>
            
            {/* Meal Timing */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight="bold" color="primary">
                Meal Timing:
              </Typography>
              <RadioGroup
                row
                name="meal"
                value={m.when.meal || "after"}
                onChange={(e) => handleMedicineChange(i, e)}
                sx={{ mt: 1 }}
              >
                <FormControlLabel
                  value="before"
                  control={<Radio size="small" />}
                  label="Before Meal"
                />
                <FormControlLabel
                  value="after"
                  control={<Radio size="small" />}
                  label="After Meal"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        variant="contained"
        color="success"
        startIcon={<AddIcon />}
        onClick={handleAddMedicine}
        sx={{ mb: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
      >
        Add Medicine
      </Button>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handlePrescriptionSubmit}
      >
        Save & Preview Prescription
      </Button>
    </Paper>
  );
};

export default AddPrescription;