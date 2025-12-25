// src/pages/Broadcast/Broadcast.tsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, List, ListItemButton,
  ListItemIcon, ListItemText, Divider, Chip, IconButton, CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from 'react-router-dom';

const SIDEBAR_WIDTH = 280;

const Broadcast: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('templates');
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (active === 'templates') {
      fetch('http://127.0.0.1:8000/api/templates/')
        .then(res => res.json())
        .then(data => {
          setTemplates(data);
          setLoading(false);
        })
        .catch(() => {
          setTemplates([]);
          setLoading(false);
        });
    }
  }, [active]);

  const handleSend = (id: number) => {
    alert(`Sending broadcast for template ID: ${id}`);
  };

 const handleEdit = (template: any) => {
  // Pass ALL template data to the edit page
  navigate('/broadcast/new', { 
    state: { 
      editMode: true, 
      template: template 
    } 
  });
};

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this template permanently?')) {
      // Future: Add DELETE API
      alert(`Template ${id} deleted`);
    }
  };

  return (
    <Box display="flex">
      {/* SIDEBAR */}
      <Paper sx={{ width: SIDEBAR_WIDTH, height: '100vh', position: 'fixed', bgcolor: '#fafafa' }}>
        <Box p={3}>
          <Typography variant="h6" fontWeight="bold" color="#00A859">
            Broadcasts
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItemButton
            selected={active === 'templates'}
            onClick={() => setActive('templates')}
            sx={{ '&.Mui-selected': { bgcolor: '#ecfdf5' } }}
          >
            <ListItemIcon sx={{ color: active === 'templates' ? '#00A859' : '#666' }}>
              <MessageIcon />
            </ListItemIcon  >
            <ListItemText primary="Your Templates" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate('/broadcast/new')}>
            <ListItemIcon sx={{ color: '#00A859' }}><AddIcon /></ListItemIcon>
            <ListItemText primary="New Template Message" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate('/broadcast/analytics')}>
            <ListItemIcon sx={{ color: '#666' }}><AnalyticsIcon /></ListItemIcon>
            <ListItemText primary="Broadcast Analytics" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate('/broadcast/schedule')}>
            <ListItemIcon sx={{ color: '#666' }}><ScheduleIcon /></ListItemIcon>
            <ListItemText primary="Scheduled Broadcasts" />
          </ListItemButton>
        </List>
      </Paper>

      {/* MAIN CONTENT */}
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4, width: `calc(100% - ${SIDEBAR_WIDTH}px)` }}>
        {active === 'templates' && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Your Templates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select or create your template and submit it for WhatsApp approval. All templates must adhere to WhatsApp's guidelines.
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => navigate('/broadcast/new')}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                New Template Message
              </Button>
            </Box>

            {loading ? (
              <Box textAlign="center" py={10}><CircularProgress /></Box>
            ) : templates.length === 0 ? (
              <Paper sx={{ p: 10, textAlign: 'center', bgcolor: '#f9fafb' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>No templates yet</Typography>
                <Typography color="text.secondary" mb={3}>Create your first WhatsApp template</Typography>
                <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => navigate('/broadcast/new')}>
                  Create Template
                </Button>
              </Paper>
            ) : (
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                      <TableCell><strong>Template Name</strong></TableCell>
                      <TableCell><strong>Category</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Language</strong></TableCell>
                      <TableCell><strong>Last Updated</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {templates.map((t: any) => (
                      <TableRow key={t.id} hover>
                        <TableCell>{t.name}</TableCell>
                        <TableCell>{t.category}</TableCell>
                        <TableCell>
                          <Chip
                            label={t.status.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: t.status === 'draft' ? '#fef3c7' : t.status === 'approved' ? '#d1fae5' : '#fee2e2',
                              color: t.status === 'draft' ? '#92400e' : t.status === 'approved' ? '#065f46' : '#991b1b'
                            }}
                          />
                        </TableCell>
                        <TableCell>{t.language.toUpperCase()}</TableCell>
                        <TableCell>{new Date(t.created_at).toLocaleDateString()}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            {/* EDIT BUTTON — ONLY FOR DRAFT */}
                            {t.status === 'draft' && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={<EditIcon />}
                               onClick={() => handleEdit(t)}
                              >
                                Edit
                              </Button>
                            )}

                            {/* SEND BROADCAST BUTTON */}
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              startIcon={<SendIcon />}
                              onClick={() => handleSend(t.id)}
                            >
                              Send Broadcast
                            </Button>

                            {/* DELETE BUTTON */}
                            <IconButton size="small" color="error" onClick={() => handleDelete(t.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Broadcast;