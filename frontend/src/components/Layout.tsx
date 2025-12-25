import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Tooltip, Avatar, Badge, Divider
} from '@mui/material';
import {
  Inbox as InboxIcon,
  People as PeopleIcon,
  Send as SendIcon,
  AutoFixHigh as AutoFixHighIcon,
  BarChart as BarChartIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      {/* TOP MENU BAR — SAME ON EVERY PAGE */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          bgcolor: '#fff',
          color: '#000',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: 56 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ flexGrow: 1, color: '#00A884', letterSpacing: 0.5 }}
          >
            CONVIX
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/inbox" startIcon={<InboxIcon />} color="inherit">
              Inbox
            </Button>
            <Button component={Link} to="/contacts" startIcon={<PeopleIcon />} color="inherit">
              Contacts
            </Button>
            <Button component={Link} to="/broadcast" startIcon={<SendIcon />} color="inherit">
              Broadcast
            </Button>
            <Button component={Link} to="/automation" startIcon={<AutoFixHighIcon />} color="inherit">
              Automation
            </Button>
            <Button component={Link} to="/analytics" startIcon={<BarChartIcon />} color="inherit">
              Analytics
            </Button>
            <Button component={Link} to="/users" startIcon={<GroupIcon />} color="inherit">
              User Management
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge color="error" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Tooltip title="Your Profile">
              <Avatar
                alt="Admin"
                src="https://ui-avatars.com/api/?name=Admin&background=00A884&color=fff"
                sx={{ width: 36, height: 36, cursor: 'pointer' }}
              />
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* PAGE CONTENT GOES HERE */}
      <Box sx={{ mt: 8 }}>
        <Outlet />
      </Box>
    </>
  );
}