// src/pages/Automation/AutomationLayout.tsx
import React, { useState } from 'react';
import { Box, Paper, List, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RepeatIcon from '@mui/icons-material/Repeat';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const SIDEBAR_WIDTH = 280;

const AutomationLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'rules';

  const menuItems = [
    { id: 'rules', label: 'Rules', icon: <AutoFixHighIcon />, path: '/automation/rules' },
    { id: 'chatbot', label: 'Chatbot', icon: <SmartToyIcon />, path: '/automation/chatbot' },
    { id: 'sequence', label: 'Sequence', icon: <RepeatIcon />, path: '/automation/sequence' },
    { id: 'reply-material', label: 'Reply Material', icon: <ReplyAllIcon />, path: '/automation/reply-material' },
  ];

  return (
    <Box display="flex">
      {/* SIDEBAR */}
      <Paper sx={{ width: SIDEBAR_WIDTH, height: '100vh', position: 'fixed', bgcolor: '#fafafa' }}>
        <Box p={3}>
          <Typography variant="h6" fontWeight="bold" color="#00A859">Automation</Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.id}
              selected={currentTab === item.id || (item.id === 'triggers' && currentTab === 'rules')}
              onClick={() => navigate(item.path)}
              sx={{ '&.Mui-selected': { bgcolor: '#ecfdf5' } }}
            >
              <ListItemIcon sx={{ color: currentTab === item.id || (item.id === 'triggers' && currentTab === 'rules') ? '#00A859' : '#666' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* MAIN CONTENT */}
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4, width: `calc(100% - ${SIDEBAR_WIDTH}px)` }}>
        <Outlet /> {/* This renders the child pages */}
      </Box>
    </Box>
  );
};

export default AutomationLayout;