import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper, Link, InputAdornment, Avatar, Alert } from '@mui/material';
import { Mail, ChevronLeft, Pill } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ mb: 2 }}>
            <Link component={RouterLink} to="/login" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              <ChevronLeft size={16} /> Back to Login
            </Link>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}><Pill /></Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Reset Password</Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Enter your email and we'll send you instructions to reset your password.
            </Typography>
          </Box>

          {submitted ? (
            <Alert severity="success">
              If an account exists for that email, we have sent password reset instructions.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                required
                sx={{ mb: 3 }}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><Mail size={20} /></InputAdornment>,
                  },
                }}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ py: 1.5 }}>
                Send Reset Link
              </Button>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
