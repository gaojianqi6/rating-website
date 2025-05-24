'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { getProfile, updateProfile } from '@/api/user';
import { uploadImage } from '@/api/file';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { SelectChangeEvent } from '@mui/material/Select';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  nickname: string | null;
  description: string | null;
  country: string | null;
  avatar: string | null;
}

const SettingsPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    nickname: '',
    description: '',
    country: '',
    avatar: '',
  });
  const { setUser } = useUserStore();

  // List of countries for dropdown (simplified)
  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'India',
    'China',
    'Japan',
    'Brazil',
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getProfile() as UserProfile;
        setProfile(userData);
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          nickname: userData.nickname || '',
          description: userData.description || '',
          country: userData.country || '',
          avatar: userData.avatar || '',
        });
        setAvatarPreview(userData.avatar || null);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // Cleanup preview URL on unmount
    return () => {
      if (avatarPreview && avatarFile) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, country: event.target.value as string }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (jpg, jpeg, png)
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPG or PNG files are allowed.');
        setAvatarFile(null);
        setAvatarPreview(null);
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('File size must be less than 5MB.');
        setAvatarFile(null);
        setAvatarPreview(null);
        return;
      }

      // Validate image dimensions (square)
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width !== img.height) {
          setError('Please upload a square image for the avatar');
          setAvatarFile(null);
          setAvatarPreview(null);
          return;
        }
        // Clean up previous preview if exists
        if (avatarPreview && avatarFile) {
          URL.revokeObjectURL(avatarPreview);
        }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        setError(null);
      };
    }
  };

  const handleSubmit = async () => {
    if (!profile) return;

    // Basic validation
    if (!formData.username || !formData.email) {
      setError('Username and email are required.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      let updatedAvatar = formData.avatar;

      // Upload new avatar if changed
      if (avatarFile) {
        const type = `avatar/${profile.id}`;
        const uploadResult = await uploadImage(avatarFile, type) as { presignedUrl: string; publicUrl: string };
        await fetch(uploadResult.presignedUrl, {
          method: 'PUT',
          body: avatarFile,
          headers: {
            'Content-Type': avatarFile.type,
          },
        });
        updatedAvatar = uploadResult.publicUrl;
      }

      // Prepare updated profile data (exclude username and email)
      const updatedProfile = {
        nickname: formData.nickname || null,
        description: formData.description || null,
        country: formData.country || null,
        avatar: updatedAvatar || null,
      };

      // Log the payload for debugging
      console.log('Updating profile with payload:', updatedProfile);

      // Update profile
      const user = await updateProfile(profile.id, updatedProfile);
      setUser(user);
      setSuccess('Profile updated successfully');
      setProfile((prev) => prev ? { ...prev, ...updatedProfile } : null);
      setAvatarFile(null); // Reset avatar file after upload
      setAvatarPreview(updatedAvatar || null);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Container maxWidth="md" className="py-6 flex justify-center">
        <CircularProgress />
      </Container>
    );
  }

  if (error && !profile) {
    return (
      <Container maxWidth="md" className="py-6">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="py-6">
      <Typography
        variant="h4"
        gutterBottom
        className="text-left font-bold text-gray-800 mb-6 text-[16px]"
      >
        Account Settings
      </Typography>

      {success && (
        <Alert severity="success" className="mb-4">
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Box className="p-6 rounded-lg shadow-lg">
        <Box className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          <Box className="flex flex-col items-center">
            <Avatar
              src={avatarPreview || '/placeholder.jpg'}
              alt={formData.username}
              sx={{ width: 100, height: 100 }}
              className="mb-4"
            />
            <Button
              variant="contained"
              component="label"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upload Avatar
              <input
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={handleAvatarChange}
              />
            </Button>
            <Box className="flex justify-center mt-2 w-full">
              <Link href="/user/change-password" passHref legacyBehavior>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  className="text-xs underline hover:no-underline"
                  sx={{ textTransform: 'none', fontSize: 13, px: 0, minWidth: 0 }}
                >
                  Change Password
                </Button>
              </Link>
            </Box>
          </Box>
          <Box className="flex-1 w-full">
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              className="mb-4"
              disabled
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              className="mb-4"
              disabled
            />
            <TextField
              label="Nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              className="mb-4"
            />
          </Box>
        </Box>

        <FormControl fullWidth margin="normal" className="mb-4">
          <InputLabel>Country</InputLabel>
          <Select
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleCountryChange}
          >
            <MenuItem value="">None</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          className="mb-4"
        />

        <Box className="flex justify-end mt-6">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SettingsPage;