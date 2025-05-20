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
import Image from "next/image";
import ProjectDescription from '@/components/auth/ProjectDescription';

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
        await fetchUser();
        router.push("/");
        return;
      }
      throw new Error("No access token received");
    } catch (error: unknown) {
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
      <Box
        className="w-full h-screen md:h-auto md:w-full md:max-w-3xl bg-white md:rounded-2xl md:shadow-xl flex flex-col md:flex-row overflow-hidden md:my-0 md:mx-auto md:mt-0 md:mb-0"
        sx={{
          minHeight: { xs: '100vh', md: 420 },
          borderRadius: { xs: 0, md: 4 },
          boxShadow: { xs: 'none', md: 3 },
        }}
      >
        {/* Login Form Section */}
        <Box
          className="flex-1 flex flex-col items-center justify-center p-4 md:p-6"
          sx={{ minWidth: { xs: '100%', md: 340 }, maxWidth: 420 }}
        >
          <Image src="/logo.png" alt="Logo" width={104} height={48} className="mb-2" />
          <Typography variant="h6" align="center" gutterBottom fontWeight={700}>
            Sign in to Rating everything
          </Typography>
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
            <TextField
              label="Email/Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              placeholder="Email/Username"
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{ shrink: true }}
              autoComplete="username"
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              placeholder="Password, at least 6 characters"
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 1, fontWeight: 600, py: 1.2, fontSize: 16 }}
            >
              Login
            </Button>
          </form>
          <Box className="mt-2 text-center w-full">
            <Typography variant="body2" component="span">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </Typography>
          </Box>
          <Box className="mt-6 flex justify-center w-full">
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              fullWidth
              sx={{ fontWeight: 600, py: 1.1, fontSize: 15 }}
            >
              Sign in with Google
            </Button>
          </Box>
        </Box>
        {/* Divider and Description Section */}
        <ProjectDescription />
      </Box>
      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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