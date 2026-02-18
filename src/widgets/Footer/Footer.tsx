/**
 * Footer Widget
 * Migrated to widget architecture
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Typography, Box, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube, Email, Apple, Android } from '@mui/icons-material';

/**
 * Footer — displays product links, support links, and social media icons.
 * Styled to match the red footer section in your design.
 */
const Footer: React.FC = () => {
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
      sx={(theme) => ({
        color: 'white',
        py: 5,
        backgroundColor: theme.palette.coolRed[950], // #490812 - darkest coolRed from Figma
        overflow: 'hidden',
      })}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(7, 1fr)' },
        }}
      >
        {/* Brand & Social Section */}
        <Box sx={{ gridColumn: { md: 'span 2' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Image
              src="/predict-galore-logo.png"
              alt="Predict Galore"
              width={140}
              height={36}
              quality={75}
              style={{ height: '36px', width: 'auto' }}
            />
          </Box>
          {/* tagline */}
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem',
              mb: 3,
            }}
          >
            Smart predictions. Smarter choices.
          </Typography>

          {/* Social Links */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
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
            sx={{
              fontFamily: 'var(--font-ultra)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              mb: 1.5,
            }}
          >
            Download our App
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, fontSize: '0.875rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Apple fontSize="small" />
              <Typography variant="body2" sx={{ color: 'white' }}>
                App Store
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Android fontSize="small" />
              <Typography variant="body2" sx={{ color: 'white' }}>
                Google Play
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* COMPANY Section */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: 'var(--font-ultra)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              mb: 1.5,
            }}
          >
            COMPANY
          </Typography>
          <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.875rem', listStyle: 'none', p: 0, m: 0 }}>
            <Box component="li">
              <Box
                component={Link}
                href="/docs/predict-galore-about-us.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                About Us
              </Box>
            </Box>
            <Box component="li">
              <Box
                component={Link}
                href="/careers"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Careers
              </Box>
            </Box>
            <Box component="li">
              <Box
                component={Link}
                href="/faqs"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                FAQs
              </Box>
            </Box>
          </Box>
        </Box>

        {/* LEGAL Section */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: 'var(--font-ultra)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              mb: 1.5,
            }}
          >
            LEGAL
          </Typography>
          <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.875rem', listStyle: 'none', p: 0, m: 0 }}>
            <Box component="li">
              <Box
                component={Link}
                href="/docs/predict-galore-privacy-policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Privacy Policy
              </Box>
            </Box>
            <Box component="li">
              <Box
                component={Link}
                href="/docs/predict-galore-terms-of-use.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Terms of Use
              </Box>
            </Box>
            <Box component="li">
              <Box
                component={Link}
                href="/docs/predict-galore-cookie-policy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Cookie Policy
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Get in Touch */}
        <Box sx={{ gridColumn: { md: 'span 2' } }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: 'var(--font-ultra)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.7)',
              mb: 1.5,
            }}
          >
            Get in Touch
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
            +2349068192247
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
            <Email fontSize="small" sx={{ mr: 0.5 }} /> customerservice@predictgalore.com
          </Typography>
        </Box>
      </Container>

      {/* Gambling Problem Section */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderLeft: '4px solid',
            borderLeftColor: 'secondary.light',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: 'var(--font-ultra)',
              fontWeight: 400,
              color: 'secondary.light',
              mb: 1,
            }}
          >
            Gambling Problem? Call GambleAlert.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '0.875rem' }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Support Email:{' '}
              <Box
                component={Link}
                href="mailto:support@gamblealert.org"
                sx={{
                  color: 'info.light',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                support@gamblealert.org
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Website:{' '}
              <Box
                component={Link}
                href="https://gamblealert.org/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'info.light',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                https://gamblealert.org/
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Helpline: +2347058890073, +2347058890074
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Copyright */}
      <Box
        sx={{
          mt: 5,
          textAlign: 'center',
          borderTop: '1px solid',
          borderTopColor: 'rgba(255,255,255,0.3)',
          pt: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.5)',
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