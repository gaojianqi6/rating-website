"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1);

  const handleRegister = async (e) => {
    e.preventDefault();
    // Perform registration logic with email, username, and password
    // You can make an API request to your backend here
    // If registration is successful, redirect to the login page or dashboard
    router.push('/auth/login');
  };

  const handleSendVerificationCode = async () => {
    // Send verification code to the provided email address
    // You can make an API request to your backend here
    setStep(2);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Box className="w-full max-w-md p-6 bg-white rounded shadow">
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        {step === 1 && (
          <form onSubmit={handleSendVerificationCode}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
              Send Verification Code
            </Button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleRegister}>
            <TextField
              label="Verification Code"
              fullWidth
              margin="normal"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
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
              Register
            </Button>
          </form>
        )}
      </Box>
    </div>
  );
};

export default RegisterPage;