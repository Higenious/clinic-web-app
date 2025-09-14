import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  useTheme
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const GreetingBanner = ({ name = 'Doctor' }) => {
  const hour = new Date().getHours();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const theme = useTheme();
  const isMorning = hour < 12;
  const isAfternoon = hour >= 12 && hour < 17;
  const isEvening = hour >= 17;
  console.log(isEvening);

  const greeting = isMorning
    ? 'Good Morning'
    : isAfternoon
    ? 'Good Afternoon'
    : 'Good Evening';

  const icon = isMorning ? <WbSunnyIcon /> : <NightsStayIcon />;
  const backgroundColor = isMorning
    ? theme.palette.primary.light
    : theme.palette.secondary.light;

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor,
        px: 3,
        py: 2,
        borderRadius: 2,
        mb: 3,
        color: theme.palette.getContrastText(backgroundColor)
      }}
    >
      <Avatar
        src="/doctor-avatar.png"
        alt="Doctor"
        sx={{ width: 56, height: 56 }}
      />
      <Box flex="1">
        <Typography variant="h6">
          Hello {name} 👋, it's <AccessTimeIcon fontSize="small" /> {time}
        </Typography>
        <Typography variant="body2">
          {greeting}, hope you’re ready for a productive day!
        </Typography>
      </Box>
      {icon}
    </Paper>
  );
};

export default GreetingBanner;
