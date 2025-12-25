// src/pages/Automation/ReplyMaterialPage.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
export default function ReplyMaterialPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>Reply Material</Typography>
      <Paper sx={{ p: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">Quick Replies & Saved Messages</Typography>
      </Paper>
    </Box>
  );
}