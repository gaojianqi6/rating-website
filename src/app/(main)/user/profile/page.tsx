

"use client";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ProfilePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Box className="w-full max-w-md p-6 bg-white rounded shadow">
        <Typography variant="h4" align="center" gutterBottom>
          Profile
        </Typography>
        
      </Box>
    </div>
  );
};

export default ProfilePage;