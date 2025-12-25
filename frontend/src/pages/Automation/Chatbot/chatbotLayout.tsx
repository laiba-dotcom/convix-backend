// src/pages/Automation/Chatbot/chatbotLayout.tsx
import React from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';

export default function ChatbotLayout() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          Chatbots
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Build powerful automated conversations with drag & drop — no coding needed.
        </Typography>
      </Box>

      {/* Add New Chatbot Button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Your Chatbots
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/automation/chatbot/new')}
          sx={{
            bgcolor: '#00A884',
            '&:hover': { bgcolor: '#008f6e' },
            px: 4,
            py: 1.5,
            fontSize: '1rem',
          }}
        >
          Create New Chatbot
        </Button>
      </Stack>

      {/* This renders ChatbotList or ChatbotBuilder */}
      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}