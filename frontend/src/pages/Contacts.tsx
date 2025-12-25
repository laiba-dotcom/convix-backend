import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, InputLabel, Select, MenuItem, FormControl, Alert, Link,
  IconButton, Tooltip, Avatar, TablePagination, Checkbox, CircularProgress
} from '@mui/material';
import {
  Upload, Download, Add, Phone, Person, Edit, Delete, MoreVert,
  WhatsApp, CheckCircle, Cancel
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

interface Contact {
  id: number;
  name: string;
  phone: string;
  source: string;
  lead_stage: string;
  contact_owner: string;
  allowBroadcast: boolean;
  allowSMS: boolean;
}

export default function Contacts() {
  const [file, setFile] = useState<File | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [phone, setPhone] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchContacts = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/contacts/');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error('Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('uploading');
    setUploadMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/contacts/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Upload failed');
      }

      const result = await res.json();
      setUploadStatus('success');
      setUploadMessage(`✅ ${result.imported} contacts imported`);
      await fetchContacts();
      setPage(0);        // ← FIXED: Reset to first page
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setUploadStatus('error');
      setUploadMessage('Check Django terminal for error');
    }
  };

  const handleAddContact = async () => {
    const newContact = {
      name,
      phone: countryCode + phone,
      source: 'Manual',
      lead_stage: 'New Lead',
      allow_broadcast: true,
      allow_sms: true
    };

    await fetch('http://127.0.0.1:8000/api/contacts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact)
    });

    await fetchContacts();
    setPage(0);           // ← FIXED: Reset to first page
    setOpenAdd(false);
    setName('');
    setPhone('');
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/api/contacts/${id}/`, { method: 'DELETE' });
    await fetchContacts();
    setPage(0);           // ← FIXED: Reset after delete
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* UPPER SECTION */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">Contacts</Typography>
            <Typography variant="body2" color="text.secondary">
              Contact list stores the list of numbers that you’ve interacted with. You can even manually export or import contacts.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
  variant="outlined"
  startIcon={<Download />}
  onClick={() => {
    // Create Excel file in browser — no backend needed
    const data = contacts.map(c => ({
      Name: c.name || '—',
      Phone: c.phone,
      Source: c.source,
      'Lead Stage': c.lead_stage || 'New Lead',
      'Allow Broadcast': c.allowBroadcast ? 'Yes' : 'No',
      'Allow SMS': c.allowSMS ? 'Yes' : 'No',
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");

    // Trigger download
    XLSX.writeFile(wb, `convix-contacts-${new Date().toISOString().slice(0,10)}.xlsx`);
  }}
  sx={{ mr: 1 }}
>
  Export Excel
</Button>

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outlined" component="span" startIcon={<Upload />}>
                Import
              </Button>
            </label>

            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAdd(true)} sx={{ bgcolor: '#00A884' }}>
              Add Contact
            </Button>
          </Box>
        </Box>

        {file && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Selected: <strong>{file.name}</strong>
            <Button size="small" onClick={handleUpload} disabled={uploadStatus === 'uploading'} sx={{ ml: 2 }}>
              {uploadStatus === 'uploading' ? <CircularProgress size={20} /> : 'Upload Now'}
            </Button>
          </Alert>
        )}

        {uploadStatus === 'success' && <Alert severity="success">{uploadMessage}</Alert>}
        {uploadStatus === 'error' && <Alert severity="error">{uploadMessage}</Alert>}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          <strong>How to format the CSV/Excel?</strong><br />
          Must have: <code>name</code>, <code>phone</code> (with country code).<br />
          Optional: <code>allow_broadcast</code> (Yes/No), <code>allow_sms</code> (Yes/No).<br />
          <Link href="/sample.csv" underline="hover" color="primary">Download Sample File</Link>
        </Typography>
      </Paper>

      {/* TABLE */}
      {loading ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography>Loading contacts...</Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox /></TableCell>
                <TableCell><strong>Basic Info</strong></TableCell>
                <TableCell><strong>Phone Number</strong></TableCell>
                <TableCell><strong>Source</strong></TableCell>
                <TableCell><strong>Contact Attributes</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell padding="checkbox"><Checkbox /></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: '#00A884', width: 32, height: 32, fontSize: 14 }}>
                          {c.name ? c.name[0] : c.phone.slice(-2)}
                        </Avatar>
                        <Typography fontWeight="bold">{c.name || '—'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WhatsApp sx={{ color: '#25D366' }} />
                        {c.phone}
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={c.source} size="small" /></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label="lead_stage: New Lead" size="small" />
                        <Chip label={`Broadcast: ${c.allowBroadcast ? 'TRUE' : 'FALSE'}`} size="small" color={c.allowBroadcast ? 'success' : 'error'} />
                        <Chip label={`SMS: ${c.allowSMS ? 'TRUE' : 'FALSE'}`} size="small" color={c.allowSMS ? 'success' : 'error'} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(c.id)}>
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* FIXED PAGINATION */}
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={contacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);   // ← FIXED: Always go back to page 1
            }}
            labelRowsPerPage="Rows per page:"
          />
        </Paper>
      )}

      {/* ADD CONTACT DIALOG */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add Contact</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2 }} />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Code</InputLabel>
              <Select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                <MenuItem value="+966">+966 Saudi</MenuItem>
                <MenuItem value="+971">+971 UAE</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddContact} sx={{ bgcolor: '#00A884' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}