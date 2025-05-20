"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Button, TextField, Snackbar, Alert, Divider } from '@mui/material';
import { registerUser } from '@/api/user';
import Image from 'next/image';

const description = [
  {
    title: 'Personalized Recommendations',
    text: "Discover shows you'll love."
  },
  {
    title: 'Your Ratings',
    text: "Rate and remember everything you've seen."
  },
  {
    title: 'Contribute to Rating everything',
    text: "Add data that will be seen by many people."
  }
];

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !username || !password || !confirmPassword) {
      setToast({ open: true, message: 'All fields are required.', severity: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ open: true, message: 'Passwords do not match.', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      await registerUser({ username, password, confirmPassword, email });
      setToast({ open: true, message: 'Registration successful! Redirecting...', severity: 'success' });
      setTimeout(() => router.push('/auth/login'), 1200);
    } catch (error: unknown) {
      let errorMessage = 'Registration failed. Please try again.';
      if (
        error &&
        typeof error === 'object' &&
        'message' in (error as Record<string, unknown>) &&
        typeof (error as Record<string, unknown>).message === 'string'
      ) {
        errorMessage = (error as Record<string, unknown>).message as string;
      }
      setToast({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleToastClose = () => setToast({ ...toast, open: false });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Box
        className="w-full h-screen md:h-auto md:w-full md:max-w-3xl bg-white md:rounded-2xl md:shadow-xl flex flex-col md:flex-row overflow-hidden md:my-0 md:mx-auto md:mt-0 md:mb-0"
        sx={{
          minHeight: { xs: '100vh', md: 420 },
          borderRadius: { xs: 0, md: 4 },
          boxShadow: { xs: 'none', md: 3 },
        }}
      >
        {/* Register Form Section */}
        <Box
          className="flex-1 flex flex-col items-center justify-center p-4 md:p-6"
          sx={{ minWidth: { xs: '100%', md: 340 }, maxWidth: 420 }}
        >
          <Image src="/logo.png" alt="Logo" width={104} height={48} className="mb-2" />
          <Typography variant="h6" align="center" gutterBottom fontWeight={700}>
            Create your Rating account
          </Typography>
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-3">
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ shrink: true }}
              autoComplete="email"
              required
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{ shrink: true }}
              autoComplete="username"
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              autoComplete="new-password"
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              autoComplete="new-password"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 1, fontWeight: 600, py: 1.2, fontSize: 16 }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <Box className="mt-2 text-center w-full">
            <Typography variant="body2" component="span">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
        {/* Divider and Description Section */}
        <Divider orientation="vertical" flexItem className="hidden md:block" />
        <Box
          className="hidden md:flex flex-col justify-center bg-white p-8 min-w-[320px] max-w-xs"
        >
          <Typography variant="h5" fontWeight={700} className="mb-4">
            Benefits of your free Rating account
          </Typography>
          {description.map((item, idx) => (
            <Box key={item.title} className={idx !== 0 ? 'mt-4' : ''}>
              <Typography variant="subtitle1" fontWeight={700}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RegisterPage;