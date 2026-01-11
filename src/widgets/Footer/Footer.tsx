/**
 * Footer Widget
 * Migrated to widget architecture
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Typography, Box, IconButton, useTheme } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube, Email, Apple, Android } from '@mui/icons-material';

/**
 * Footer — displays product links, support links, and social media icons.
 * Styled to match the red footer section in your design.
 */
const Footer: React.FC = () => {
  const theme = useTheme();

  const socialLinks = [
    {
      platform: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/PredictGalore',
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/PredictGalore',
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/PredictGalore',
    },
    {
      platform: 'YouTube',
      icon: YouTube,
      url: 'https://youtube.com/@PredictGalore',
    },
    {
      platform: 'TikTok',
      icon: null,
      url: 'https://tiktok.com/@predict.galore',
    },
  ];

  return (
    <Box
      className="text-white py-10"
      sx={{
        backgroundColor: '#640C0F',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" className="grid grid-cols-1 md:grid-cols-7 ">
        {/* Brand & Social Section */}
        <Box className="md:col-span-2">
          <Box className="flex items-center mb-4">
            <Image
              src="/predict-galore-logo.png"
              alt="Predict Galore"
              width={140}
              height={36}
              quality={75}
              className="h-9 w-auto"
            />
          </Box>
          {/* tagline */}
          <Typography
            variant="body2"
            className="mb-6"
            sx={{
              color: theme.palette.text.disabled || 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem',
            }}
          >
            Smart predictions. Smarter choices.
          </Typography>

          {/* Social Links  */}
          <Box className="mb-6">
            <Box className="flex gap-2">
              {socialLinks.map((social) =>
                social.icon ? (
                  <IconButton
                    key={social.platform}
                    component={Link}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="medium"
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    <social.icon />
                  </IconButton>
                ) : (
                  // TikTok button (no MUI icon)
                  <IconButton
                    key={social.platform}
                    component={Link}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="medium"
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      fontSize: '0.875rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    TT
                  </IconButton>
                )
              )}
            </Box>
          </Box>
        </Box>

        {/* PRODUCT Section */}
        <Box>
          <Typography
            variant="subtitle1"
            className="mb-3"
            sx={{
              fontFamily: 'var(--font-ultra)',
              fontWeight: 400,
              color: theme.palette.text.disabled || 'rgba(255,255,255,0.7)',
            }}
          >
            Download our App
          </Typography>
          <Box className="space-y-3 text-sm">
            <Box className="flex items-center gap-2">
              <Apple fontSize="small" />
              <Typography variant="body2">App Store</Typography>
            </Box>
            <Box className="flex items-center gap-2">
              <Android fontSize="small" />
              <Typography variant="body2">Google Play</Typography>
            </Box>
          </Box>
        </Box>

        {/* COMPANY Section */}
        <Box>
          <Typography
            variant="subtitle1"
            className="mb-3"
            sx={{
              fontFamily: 'var(--font-ultra)',
              fontWeight: 400,
              color: theme.palette.text.disabled || 'rgba(255,255,255,0.7)',
            }}
          >
            COMPANY
          </Typography>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/docs/predict-galore-about-us.pdf"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="hover:underline">
                FAQs
              </Link>
            </li>
          </ul>
        </Box>

        {/* LEGAL Section */}
        <Box>
          <Typography
            variant="subtitle1"
            className="mb-3"
            sx={{
              fontFamily: 'var(--font-ultra)',
              fontWeight: 400,
              color: theme.palette.text.disabled || 'rgba(255,255,255,0.7)',
            }}
          >
            LEGAL
          </Typography>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/docs/predict-galore-privacy-policy.pdf"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/docs/predict-galore-terms-of-use.pdf"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use
              </Link>
            </li>
            <li>
              <Link
                href="/docs/predict-galore-cookie-policy.pdf"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </Box>

        {/* Get in Touch */}
        <Box className="md:col-span-2">
          <Typography
            variant="subtitle1"
            className="mb-3"
            sx={{
              fontFamily: 'var(--font-ultra)',
              fontWeight: 400,
              color: theme.palette.text.disabled || 'rgba(255,255,255,0.7)',
            }}
          >
            Get in Touch
          </Typography>
          <Typography variant="body2" className="mb-2" sx={{ color: 'white' }}>
            +2349068192247
          </Typography>
          <Typography variant="body2" className="mb-2" sx={{ color: 'white' }}>
            <Email fontSize="small" className="mr-1" /> customerservice@predictgalore.com
          </Typography>
        </Box>
      </Container>

      {/* Gambling Problem Section  */}
      <Container maxWidth="lg" className="mt-8">
        <Box
          className="p-4 rounded"
          sx={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderLeft: '4px solid #ff6b6b',
          }}
        >
          <Typography
            variant="subtitle2"
            className="mb-2"
            sx={{
              fontFamily: 'var(--font-ultra)',
              fontWeight: 400,
              color: '#ff6b6b',
            }}
          >
            Gambling Problem? Call GambleAlert.
          </Typography>

          <Box className="space-y-1 text-sm">
            <Typography variant="body2" sx={{ color: 'white' }}>
              Support Email:{' '}
              <Link href="mailto:support@gamblealert.org" className="hover:underline text-blue-200">
                support@gamblealert.org
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Website:{' '}
              <Link
                href="https://gamblealert.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-blue-200"
              >
                https://gamblealert.org/
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Helpline: +2347058890073, +2347058890074
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* copyright */}
      <Box
        className="mt-10 text-center border-t pt-4"
        sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.disabled || 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-ultra)',
          }}
        >
          © 2025 Predict Galore. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
