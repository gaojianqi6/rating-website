'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { changePassword } from '@/api/user';
import { toLogin } from '@/utils/auth';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setAlert({ type: 'error', message: 'All fields are required.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setAlert({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword, confirmPassword);
      setAlert({ type: 'success', message: 'Password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      toLogin();
    } catch (err: any) {
      setAlert({ type: 'error', message: err?.message || 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="py-8 flex flex-col items-center">
      <Box className="w-full bg-white rounded-lg shadow-lg p-6 mt-8">
        <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
          Change Password
        </Typography>
        {alert && (
          <Alert severity={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Old Password"
            type={showOld ? 'text' : 'password'}
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOld(v => !v)} edge="end">
                    {showOld ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNew(v => !v)} edge="end">
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(v => !v)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, fontWeight: 600, py: 1.2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePasswordPage;
