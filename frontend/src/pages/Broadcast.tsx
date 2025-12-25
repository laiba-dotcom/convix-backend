// frontend/src/pages/Broadcast.tsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  Chip, Avatar, CircularProgress, IconButton, Checkbox, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ScheduleIcon from '@mui/icons-material/Schedule';

interface Contact {
  id: number;
  name: string;
  phone: string;
}

interface Broadcast {
  id: number;
  message: string;
  contacts: number[];
  status: 'sent' | 'pending' | 'failed';
  sent_at: string;
}

const Broadcast: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    message: '',
    selectedContacts: [] as number[],
    media: null as File | null,
    schedule: false,
    scheduleTime: ''
  });

  useEffect(() => {
    fetchContacts();
    fetchBroadcasts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/contacts/');
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const fetchBroadcasts = async () => {
    // Mock data
    setBroadcasts([
      { id: 1, message: "Eid Mubarak!", contacts: [1, 2], status: 'sent', sent_at: '2025-11-16 09:00' },
      { id: 2, message: "New Offer!", contacts: [1], status: 'pending', sent_at: '' }
    ]);
  };

  const handleSend = () => {
    if (!form.message || form.selectedContacts.length === 0) {
      alert("Message and at least 1 contact required!");
      return;
    }
    alert(`Broadcast sent to ${form.selectedContacts.length} contacts!`);
    setOpen(false);
    setForm({ message: '', selectedContacts: [], media: null, schedule: false, scheduleTime: '' });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, ml: '340px', mt: '64px', textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, ml: '340px', mt: '64px' }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="#00A859">
          Broadcast Messages
        </Typography>
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Broadcast
        </Button>
      </Box>

      {/* TABLE */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
        <Box display="grid" gridTemplateColumns="3fr 2fr 1.5fr 1.5fr 1fr" p={3} bgcolor="#f8f9fa" fontWeight="bold">
          <Typography>Message</Typography>
          <Typography>Recipients</Typography>
          <Typography>Status</Typography>
          <Typography>Sent At</Typography>
          <Typography>Actions</Typography>
        </Box>

        {broadcasts.length === 0 ? (
          <Box p={6} textAlign="center" color="gray">
            <Typography>No broadcasts yet. Create your first!</Typography>
          </Box>
        ) : (
          broadcasts.map(b => (
            <Box key={b.id} display="grid" gridTemplateColumns="3fr 2fr 1.5fr 1.5fr 1fr" p={3} alignItems="center" borderTop="1px solid #eee">
              <Typography noWrap fontWeight="500">{b.message}</Typography>
              <Typography>{b.contacts.length}</Typography>
              <Chip
                label={b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                color={b.status === 'sent' ? 'success' : b.status === 'pending' ? 'warning' : 'error'}
                size="small"
              />
              <Typography fontSize="0.9rem">{b.sent_at || '-'}</Typography>
              <IconButton color="primary">
                <SendIcon />
              </IconButton>
            </Box>
          ))
        )}
      </Paper>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Broadcast</DialogTitle>
        <DialogContent>
          <Box display="grid" gap={3} mt={1}>
            <TextField
              label="Message *"
              multiline
              rows={4}
              fullWidth
              placeholder="Type your WhatsApp message..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Select Contacts *</InputLabel>
              <Select
                multiple
                value={form.selectedContacts}
                onChange={e => setForm({ ...form, selectedContacts: e.target.value as number[] })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as number[]).map(id => {
                      const c = contacts.find(x => x.id === id);
                      return c ? (
                        <Chip
                          key={id}
                          label={c.name}
                          avatar={<Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>{c.name[0]}</Avatar>}
                          size="small"
                        />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {contacts.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    <Checkbox checked={form.selectedContacts.includes(c.id)} />
                    <Box>
                      <Typography fontWeight="600">{c.name}</Typography>
                      <Typography fontSize="0.8rem" color="gray">{c.phone}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" component="label" fullWidth>
              {form.media ? `Attached: ${form.media.name}` : "Attach Image/Video"}
              <input
                type="file"
                hidden
                accept="image/*,video/*"
                onChange={e => setForm({ ...form, media: e.target.files?.[0] || null })}
              />
            </Button>

            <Box display="flex" alignItems="center" gap={2}>
              <Checkbox
                checked={form.schedule}
                onChange={e => setForm({ ...form, schedule: e.target.checked })}
              />
              <ScheduleIcon color="action" />
              <Typography>Schedule Broadcast</Typography>
              {form.schedule && (
                <TextField
                  type="datetime-local"
                  value={form.scheduleTime}
                  onChange={e => setForm({ ...form, scheduleTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SendIcon />}
            onClick={handleSend}
          >
            Send Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Broadcast;
