import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Avatar, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Layout from '../utils/Layout';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'A short bio about John Doe.',
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Save the updated profile information
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <Layout>
      <Container component="main" maxWidth="md">
        <Paper sx={{ p: 3, mt: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              alt="Profile Picture"
              src="https://via.placeholder.com/150"
              sx={{ width: 100, height: 100, mr: 3 }}
            />
            <Box>
              <Typography variant="h5">{profile.name}</Typography>
              <Typography variant="body1">{profile.email}</Typography>
            </Box>
          </Box>

          <Box component="form" noValidate autoComplete="off">
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="bio"
              label="Bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!isEditing}
              multiline
              rows={4}
            />

            {isEditing ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveClick}
                sx={{ mt: 3 }}
              >
                Save
              </Button>
            ) : (
              <IconButton
                color="primary"
                onClick={handleEditClick}
                sx={{ mt: 3 }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ProfilePage;