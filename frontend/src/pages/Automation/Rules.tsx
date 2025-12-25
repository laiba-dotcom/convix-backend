 // src/pages/Automation/RulesPage.tsx
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const RulesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Rules</Typography>
          <Typography color="text.secondary">
            Create Rules to trigger automated messages, chat assignments, chatbots and more.
          </Typography>
        </Box>
        <Button variant="contained" color="success" startIcon={<AddIcon />}>
          + Create Rules
        </Button>
      </Box>

      <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#f9fafb' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No rules created yet
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Start automating your WhatsApp conversations
        </Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />}>
          Create Your First Rule
        </Button>
      </Paper>
    </Box>
  );
};

export default RulesPage;