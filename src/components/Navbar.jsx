// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" component="div">
          CureLink
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;