// src/pages/Automation/SequencePage.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
export default function Sequence() {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>Sequence</Typography>
      <Paper sx={{ p: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">Drip Campaigns & Sequences</Typography>
      </Paper>
    </Box>
  );
}