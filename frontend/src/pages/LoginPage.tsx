import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Paper,
  Avatar,
  InputAdornment
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// TUV IMAGE
const TUV_IMAGE = "https://tuvaustria.sa/wp-content/uploads/2021/08/Logooo.png"; 

export default function LoginPage() {
  const [email, setEmail] = useState('admin@convix.com');
  const [password, setPassword] = useState('admin123');
  const navigate = useNavigate();

  const handleLogin = () => {
  navigate('/'); 
};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'rgb(183,36,41)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            maxWidth: 1000,
            mx: 'auto',
          }}
        >
          {/* LEFT SIDE - LOGIN FORM */}
          <Box
            sx={{
              flex: 1,
              bgcolor: '#fff',
              color: 'black',
              p: { xs: 4, md: 8 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 4 }}>
              Please enter your details
            </Typography>

            <TextField
              fullWidth
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="filled"
              sx={{
                mb: 3,
                '& .MuiFilledInput-root': {
                  bgcolor: '#E2D7D5',
                  color: 'black',
                  '&:hover': { bgcolor: 'rgba(183, 19, 19, 0.25)' },
                  '&.Mui-focused': { bgcolor: '#E2D7D5' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(202, 22, 22, 0.7)' },
                '& .MuiFilledInput-underline:before': { borderBottomColor: 'rgba(190, 17, 17, 0.5)' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'black' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="filled"
              sx={{
                mb: 2,
                '& .MuiFilledInput-root': {
                  bgcolor: '#E2D7D5',
                  color: 'black',
                  '&:hover': { bgcolor:  'rgba(183, 19, 19, 0.25)' },
                  '&.Mui-focused': { bgcolor: 'rgba(255,255,255,0.25)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(212, 21, 21, 0.7)' },
                '& .MuiFilledInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.5)' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'black' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={<Checkbox sx={{ color: 'black' }} />}
                label={<Typography variant="body2">Remember for 30 days</Typography>}
                sx={{ color: 'black' }}
              />
              <Link href="#" underline="hover" sx={{ color: '#f08377' }}>
                Forgot password
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{
                bgcolor: 'rgb(183,36,41)',
                py: 1.8,
                fontWeight: 'bold',
                mb: 2,
                '&:hover': { bgcolor: '#00A884' },
              }}
            >
              Sign in
            </Button>

           
          </Box>

          {/* RIGHT SIDE - TUV IMAGE */}
          <Box
            sx={{
              flex: 1,
              bgcolor: '#E2D7D5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ textAlign: 'center', zIndex: 2 }}>
              <img
                src={TUV_IMAGE}
                alt="TUV Certified"
                style={{ maxWidth: '80%', height: 'auto', borderRadius: 12 }}
              />
              <Typography variant="h6" sx={{ color: 'rgb(183,36,41)', mt: 3, fontWeight: 'bold' }}>
                TUV Certified WhatsApp Solution
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                Trusted by Saudi businesses
              </Typography>
            </Box>

            {/* Decorative background icons */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 2,
                p: 4,
              }}
            >
              {[...Array(36)].map((_, i) => (
                <Box key={i} sx={{ bgcolor: 'white', borderRadius: 2 }} />
              ))}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}