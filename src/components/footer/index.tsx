// src/components/Footer.tsx
"use client";
import Link from 'next/link';

import {
  Box,
  Container,
  Typography
} from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 0,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.background.paper,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.2,
          lineHeight: 1,
        }}
      >
        <Typography variant="subtitle2" color="text.primary" fontWeight={600} sx={{ fontSize: 14 }}>
          Rate Everything
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          Discover, Rate, Share
        </Typography>
        <Typography variant="caption" color="text.disabled" align="center" sx={{ fontSize: 11 }}>
          {'Copyright © '}
          <Link color="inherit" href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Rating Website
          </Link>{' '}
          {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;