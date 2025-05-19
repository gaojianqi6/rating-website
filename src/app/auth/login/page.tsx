"use client";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Google as GoogleIcon } from "@mui/icons-material";
import { Button, TextField, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { login } from "@/api/user";
import { useUserStore } from "@/store/userStore";

interface LoginResponse {
  access_token: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { fetchUser } = useUserStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(username, password) as LoginResponse;
      if (response.access_token) {
        localStorage.setItem("accessToken", response.access_token);
        // Fetch user data after successful login
        await fetchUser();
        router.push("/");
        return;
      }
      throw new Error("No access token received");
    } catch (error: unknown) {
      // Handle network errors or unexpected issues
      const errorMessage =
        error instanceof Error ? error.message :
        "An unexpected error occurred. Please try again.";
      setToast({
        open: true,
        message: errorMessage,
      });
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  };

  const handleToastClose = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Box className="w-full max-w-md p-6 bg-white rounded shadow">
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email/Username"
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
          >
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

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={1000} // Toast disappears after 6 seconds
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at top-center
      >
        <Alert
          onClose={handleToastClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;