

"use client";
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
// import { signIn } from 'next-auth/client';

import { Google as GoogleIcon } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    // Perform login logic with username and password
    // You can make an API request to your backend here
    // If login is successful, redirect to the dashboard or home page
    window.history.pushState({}, '', '/');
    router.push('/');
  };

  const handleGoogleLogin = async () => {
    // Perform Google login using next-auth
    // await signIn('google');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Box className="w-full max-w-md p-6 bg-white rounded shadow">
        <Typography variant="h4" align="center" gutterBottom>
          Change password
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
            Login
          </Button>
        </form>
        <Box className="mt-4 text-center">
          <Link href="/auth/forgot-password">Forgot Password?</Link>
        </Box>
        <Box className="mt-4 text-center">
          Don&apos;t have an account? <Link href="/auth/register">Sign Up</Link>
        </Box>
        <Box className="mt-8 flex justify-center">
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default LoginPage;