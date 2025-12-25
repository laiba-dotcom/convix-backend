import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Analytics = () => {
  return (
    <Box sx={{ p: 4, ml: '340px', mt: '64px' }}>
      <Typography variant="h4" gutterBottom>Analytics</Typography>
      <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#f0f8f0' }}>
        <Typography variant="h5" color="success.main">
          ANALYTICS PAGE — COMING SOON
        </Typography>
      </Paper>
    </Box>
  );
};

export default Analytics;