'use client';

import React from 'react';
import { Box, Typography, Container, IconButton, Link as MuiLink, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Email, Instagram, X, Facebook, Apple, Android } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: { xs: '1rem', md: '0.9rem' },
    opacity: 0.9,
    display: 'block',
    '&:hover': { opacity: 1 },
  };

  const headerStyle = {
    fontWeight: 700,
    mb: { xs: 2, md: 3 },
    fontSize: { xs: '1.1rem', md: '1rem' },
    letterSpacing: '0.05em',
    color: 'white',
  };

  return (
    <Box
      sx={{
        bgcolor: '#5e0b0b', // Deep burgundy
        pt: { xs: 8, md: 10 },
        pb: { xs: 6, md: 4 },
        color: 'white',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
            gap: { xs: 6, md: 4 },
            mb: { xs: 6, md: 8 },
          }}
        >
          {/* Brand Section */}
          <Box>
            <Box sx={{ mb: 3 }}>
              <Image
                src="/predict-galore-logo.png"
                alt="Predict Galore"
                width={180}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </Box>
            <Typography variant="body1" sx={{ color: 'white', mb: 4, fontWeight: 400 }}>
              Smart predictions. Smarter choices.
            </Typography>

            {/* Social Icons */}
            <Stack direction="row" spacing={1.5}>
              {[
                {
                  icon: <Email fontSize="small" />,
                  href: 'mailto:customerservice@predictgalore.com',
                },
                { icon: <Instagram fontSize="small" />, href: '#' },
                { icon: <X fontSize="small" />, href: '#' },
                { icon: <Facebook fontSize="small" />, href: '#' },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.href}
                  sx={{
                    bgcolor: alpha('#fff', 0.1),
                    color: 'white',
                    width: 40,
                    height: 40,
                    '&:hover': { bgcolor: alpha('#fff', 0.2) },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* Navigation Sections */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 4, md: 2 },
            }}
          >
            {/* PRODUCT */}
            <Box>
              <Typography sx={headerStyle}>PRODUCT</Typography>
              <Stack direction="row" spacing={2}>
                <IconButton
                  component="a"
                  href="#"
                  aria-label="Download on iOS"
                  sx={{
                    bgcolor: alpha('#fff', 0.1),
                    color: 'white',
                    width: 44,
                    height: 44,
                    '&:hover': { bgcolor: alpha('#fff', 0.2) },
                  }}
                >
                  <Apple />
                </IconButton>
                <IconButton
                  component="a"
                  href="#"
                  aria-label="Download on Android"
                  sx={{
                    bgcolor: alpha('#fff', 0.1),
                    color: 'white',
                    width: 44,
                    height: 44,
                    '&:hover': { bgcolor: alpha('#fff', 0.2) },
                  }}
                >
                  <Android />
                </IconButton>
              </Stack>
            </Box>

            {/* SUPPORT */}
            <Box>
              <Typography sx={headerStyle}>SUPPORT</Typography>
              <Stack spacing={1.5}>
                <MuiLink component={Link} href="#" sx={linkStyle}>
                  FAQs
                </MuiLink>
                <MuiLink component={Link} href="#" sx={linkStyle}>
                  Contact Us
                </MuiLink>
              </Stack>
            </Box>

            {/* LEGAL */}
            <Box>
              <Typography sx={headerStyle}>LEGAL</Typography>
              <Stack spacing={1.5}>
                <MuiLink
                  component={Link}
                  href="/docs/predict-galore-privacy-policy.pdf"
                  sx={linkStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </MuiLink>
                <MuiLink
                  component={Link}
                  href="/docs/predict-galore-terms-of-use.pdf"
                  sx={linkStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </MuiLink>
                <MuiLink
                  component={Link}
                  href="/docs/predict-galore-cookie-policy.pdf"
                  sx={linkStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cookie Policy
                </MuiLink>
              </Stack>
            </Box>

            {/* CONTACT */}
            <Box>
              <Typography sx={headerStyle}>CONTACT</Typography>
              <Stack spacing={1.5}>
                <Typography sx={{ ...linkStyle, cursor: 'default' }}>
                  New York, United States
                </Typography>
                <MuiLink
                  href="mailto:customerservice@predictgalore.com"
                  sx={{ ...linkStyle, wordBreak: 'break-all' }}
                >
                  customerservice@predictgalore.com
                </MuiLink>
                <Typography sx={{ ...linkStyle, cursor: 'default' }}>+2349068192247</Typography>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Responsible Gambling Notice - Full width below content */}
        <Box
          sx={{
            bgcolor: '#0d4d0a', // Dark forest green
            p: { xs: 3, md: 3 },
            borderRadius: '4px',
            mb: 4,
            width: '100%',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: 'white' }}>
            Gambling Problem? Call GambleAlert
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 4 }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              <strong>Support Email:</strong> support@gamblealert.org
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              <strong>Website:</strong> https://gamblealert.org
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              <strong>Helplines:</strong> +2347058890073, +2347058890074
            </Typography>
          </Stack>
        </Box>

        {/* Bottom Copyright */}
        <Box
          sx={{
            pt: 2,
            borderTop: { xs: 'none', md: '1px solid rgba(255,255,255,0.1)' },
            textAlign: { xs: 'left', md: 'center' },
            opacity: 0.8,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', md: 'center' },
              gap: 0.5,
            }}
          >
            <Box component="span" sx={{ fontSize: '1.1rem' }}>
              ©
            </Box>{' '}
            2025 Predict Galore. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
