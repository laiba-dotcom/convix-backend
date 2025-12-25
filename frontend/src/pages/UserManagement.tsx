import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Tabs, Tab, Avatar, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, FormControl, InputLabel,
  Select, Menu, IconButton, CircularProgress, Checkbox, ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  team: string;
  online: boolean;
}

interface Team {
  id: number;
  name: string;
  members: number[]; // array of user IDs
}

const UserManagement: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  // Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [menuType, setMenuType] = useState<'user' | 'team'>('user');

  // Forms
  const [userForm, setUserForm] = useState({
    first_name: '', last_name: '', email: '', emailConfirm: '', phone: '', role: '', team: ''
  });

  const [teamForm, setTeamForm] = useState({
    name: '',
    members: [] as number[]
  });

  // Fetch data
  const fetchData = async () => {
    try {
      const [userRes, teamRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/users/'),
        fetch('http://127.0.0.1:8000/api/teams/')
      ]);
      const userData = await userRes.json();
      const teamData = await teamRes.json();
      setUsers(userData);
      setTeams(teamData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const openAddUser = () => {
    setEditMode(false);
    setUserForm({ first_name: '', last_name: '', email: '', emailConfirm: '', phone: '', role: '', team: '' });
    setOpenUserModal(true);
  };

  const openAddTeam = () => {
    setEditMode(false);
    setTeamForm({ name: '', members: [] });
    setOpenTeamModal(true);
  };

  const handleSaveUser = async () => {
    if (userForm.email !== userForm.emailConfirm) return alert("Emails don't match!");

    const payload = {
      first_name: userForm.first_name,
      last_name: userForm.last_name,
      email: userForm.email,
      phone: userForm.phone,
      role: userForm.role,
      team: userForm.team || "All Teams"
    };

    try {
      if (editMode && currentUser) {
        await fetch(`http://127.0.0.1:8000/api/users/${currentUser.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('http://127.0.0.1:8000/api/users/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      fetchData();
      setOpenUserModal(false);
    } catch (err) {
      alert("Save failed");
    }
  };

  const handleSaveTeam = async () => {
    if (!teamForm.name) return alert("Team name required!");

    try {
      if (editMode && currentTeam) {
        await fetch(`http://127.0.0.1:8000/api/teams/${currentTeam.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teamForm)
        });
      } else {
        await fetch('http://127.0.0.1:8000/api/teams/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teamForm)
        });
      }
      fetchData();
      setOpenTeamModal(false);
    } catch (err) {
      alert("Save failed");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const url = menuType === 'user' 
      ? `http://127.0.0.1:8000/api/users/${selectedId}/`
      : `http://127.0.0.1:8000/api/teams/${selectedId}/`;
    await fetch(url, { method: 'DELETE' });
    fetchData();
    setAnchorEl(null);
  };

  if (loading) return <Box textAlign="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="#00A859">User Management</Typography>
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<AddIcon />}
          onClick={tab === 0 ? openAddUser : openAddTeam}
        >
          {tab === 0 ? 'Add User' : 'Add Team'}
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
        <Tab label="Users" />
        <Tab label="Teams" />
      </Tabs>

      {/* USERS TAB */}
      {tab === 0 && (
        <Box bgcolor="white" borderRadius={3} boxShadow={3}>
          <Box display="grid" gridTemplateColumns="1.5fr 1fr 2fr 1.5fr 1.5fr 1fr" p={3} bgcolor="#f8f9fa" fontWeight="bold">
            <Typography>User</Typography>
            <Typography>Online Status</Typography>
            <Typography>Email/Phone</Typography>
            <Typography>Role</Typography>
            <Typography>Teams</Typography>
            <Typography>Actions</Typography>
          </Box>

          {users.map((user) => (
            <Box key={user.id} display="grid" gridTemplateColumns="1.5fr 1fr 2fr 1.5fr 1.5fr 1fr" p={3} alignItems="center" borderBottom="1px solid #eee">
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#00A859' }}>{user.first_name[0]}</Avatar>
                <Typography fontWeight="600">{user.first_name} {user.last_name}</Typography>
              </Box>
              <Chip label="Offline" size="small"  sx={{ bgcolor: '#fef2f2', color: '#dc2626', fontWeight: 'bold' , width: '70%',  maxWidth: '90px',}} />
              <Box>
                <Typography>{user.email}</Typography>
                {user.phone && <Typography fontSize="0.8rem" color="gray">{user.phone}</Typography>}
              </Box>
              <Typography>{user.role}</Typography>
              <Typography>{user.team}</Typography>
              <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedId(user.id); setMenuType('user'); }}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* TEAMS TAB */}
      {tab === 1 && (
        <Box bgcolor="white" borderRadius={3} boxShadow={3}>
          <Box display="grid" gridTemplateColumns="2fr 3fr 1fr" p={3} bgcolor="#f8f9fa" fontWeight="bold">
            <Typography>Team Name</Typography>
            <Typography>Members</Typography>
            <Typography>Actions</Typography>
          </Box>

          {teams.map((team) => {
            const memberNames = team.members.map(id => {
              const u = users.find(u => u.id === id);
              return u ? `${u.first_name} ${u.last_name}` : '';
            }).filter(Boolean).join(', ') || 'No members';

            return (
              <Box key={team.id} display="grid" gridTemplateColumns="2fr 3fr 1fr" p={3} alignItems="center" borderBottom="1px solid #eee">
                <Typography fontWeight="600">{team.name}</Typography>
                <Typography fontSize="0.9rem" color="#666">{memberNames}</Typography>
                <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedId(team.id); setMenuType('team'); }}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}

      {/* ACTION MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => {
          if (menuType === 'user') {
            const user = users.find(u => u.id === selectedId);
            if (user) {
              setCurrentUser(user);
              setUserForm({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                emailConfirm: user.email,
                phone: user.phone,
                role: user.role,
                team: user.team
              });
              setEditMode(true);
              setOpenUserModal(true);
            }
          } else {
            const team = teams.find(t => t.id === selectedId);
            if (team) {
              setCurrentTeam(team);
              setTeamForm({ name: team.name, members: team.members });
              setEditMode(true);
              setOpenTeamModal(true);
            }
          }
          setAnchorEl(null);
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* ADD/EDIT USER MODAL */}
      <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <Box display="grid" gap={2} mt={1}>
            <TextField label="First Name *" fullWidth value={userForm.first_name} onChange={e => setUserForm({...userForm, first_name: e.target.value})} />
            <TextField label="Last Name" fullWidth value={userForm.last_name} onChange={e => setUserForm({...userForm, last_name: e.target.value})} />
            <TextField label="Email *" type="email" fullWidth value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
            <TextField label="Confirm Email *" type="email" fullWidth value={userForm.emailConfirm} onChange={e => setUserForm({...userForm, emailConfirm: e.target.value})} />
            <TextField label="Phone" fullWidth value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} />
            <FormControl fullWidth>
              <InputLabel>Role *</InputLabel>
              <Select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                <MenuItem value="Operator">Operator</MenuItem>
                <MenuItem value="Administrator">Administrator</MenuItem>
                <MenuItem value="Automation Manager">Automation Manager</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserModal(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSaveUser}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ADD/EDIT TEAM MODAL */}
      <Dialog open={openTeamModal} onClose={() => setOpenTeamModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? "Edit Team" : "Add New Team"}</DialogTitle>
        <DialogContent>
          <Box display="grid" gap={2} mt={1}>
            <TextField label="Team Name *" fullWidth value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} />
            <FormControl fullWidth>
              <InputLabel>Add Members</InputLabel>
              <Select
                multiple
                value={teamForm.members}
                onChange={e => setTeamForm({...teamForm, members: e.target.value as number[]})}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as number[]).map(id => {
                      const user = users.find(u => u.id === id);
                      return user ? <Chip key={id} label={`${user.first_name} ${user.last_name}`} size="small" /> : null;
                    })}
                  </Box>
                )}
              >
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox checked={teamForm.members.includes(user.id)} />
                    <ListItemText primary={`${user.first_name} ${user.last_name} (${user.email})`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTeamModal(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSaveTeam}>Save Team</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;