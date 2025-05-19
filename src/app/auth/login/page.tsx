"use client";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Google as GoogleIcon } from "@mui/icons-material";
import { Button, TextField, Snackbar, Alert, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { login } from "@/api/user";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";

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
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden"
        sx={{
          minHeight: { xs: 0, md: 420 },
        }}
      >
        {/* Login Form Section */}
        <Box
          className="flex-1 flex flex-col items-center justify-center p-6"
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
            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline text-sm">
              Forgot Password?
            </Link>
          </Box>
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