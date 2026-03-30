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
        py: { xs: 4, sm: 5, md: 6 },
        backgroundColor: theme.palette.coolRed[950], // #490812 - darkest coolRed from Figma
        overflow: 'hidden',
      })}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Main Footer Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(7, 1fr)',
            },
            gap: { xs: 3, sm: 4, md: 3 },
          }}
        >
          {/* Brand & Social Section */}
          <Box
            sx={{
              gridColumn: { md: 'span 2' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                mb: 2,
              }}
            >
              <Image
                src="/predict-galore-logo.png"
                alt="Predict Galore"
                width={140}
                height={36}
                quality={75}
              />
            </Box>
            {/* tagline */}
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                mb: 3,
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              Smart predictions. Smarter choices.
            </Typography>

            {/* Social Links */}
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1 }, flexWrap: 'wrap' }}>
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
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          transform: { md: 'translateY(-2px)' },
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <social.icon sx={{ fontSize: { xs: 18, sm: 20 } }} />
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
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontWeight: 700,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          transform: { md: 'translateY(-2px)' },
                        },
                        transition: 'all 0.2s ease',
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
          <Box
            sx={{
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'var(--font-ultra)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.7)',
                mb: 1.5,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              }}
            >
              Download our App
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                alignItems: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Apple fontSize="small" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="body2" sx={{ color: 'white' }}>
                  App Store
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Android fontSize="small" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Google Play
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* COMPANY Section */}
          <Box
            sx={{
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'var(--font-ultra)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.7)',
                mb: 1.5,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              }}
            >
              COMPANY
            </Typography>
            <Box
              component="ul"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 0.75, sm: 1 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                listStyle: 'none',
                p: 0,
                m: 0,
                alignItems: { xs: 'center', sm: 'flex-start' },
              }}
            >
              {['About Us', 'Careers', 'FAQs'].map((item, index) => (
                <Box component="li" key={item}>
                  <Box
                    component={Link}
                    href={
                      index === 0
                        ? '/docs/predict-galore-about-us.pdf'
                        : index === 1
                          ? '/careers'
                          : '/faqs'
                    }
                    {...(index === 0 && { target: '_blank', rel: 'noopener noreferrer' })}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                      display: 'inline-block',
                      py: 0.5,
                    }}
                  >
                    {item}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* LEGAL Section */}
          <Box
            sx={{
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'var(--font-ultra)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.7)',
                mb: 1.5,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              }}
            >
              LEGAL
            </Typography>
            <Box
              component="ul"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 0.75, sm: 1 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                listStyle: 'none',
                p: 0,
                m: 0,
                alignItems: { xs: 'center', sm: 'flex-start' },
              }}
            >
              {[
                { name: 'Privacy Policy', file: 'privacy-policy' },
                { name: 'Terms of Use', file: 'terms-of-use' },
                { name: 'Cookie Policy', file: 'cookie-policy' },
              ].map((item) => (
                <Box component="li" key={item.name}>
                  <Box
                    component={Link}
                    href={`/docs/predict-galore-${item.file}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                      display: 'inline-block',
                      py: 0.5,
                    }}
                  >
                    {item.name}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Get in Touch */}
          <Box
            sx={{
              gridColumn: { md: 'span 2' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'var(--font-ultra)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.7)',
                mb: 1.5,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                gap: 0.5,
                flexWrap: 'wrap',
              }}
            >
              +2349068192247
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                mb: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                gap: 0.5,
                flexWrap: 'wrap',
                wordBreak: 'break-all',
              }}
            >
              <Email fontSize="small" sx={{ fontSize: { xs: 16, sm: 18 } }} />
              customerservice@predictgalore.com
            </Typography>
          </Box>
        </Box>

        {/* Gambling Problem Section */}
        <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
          <Box
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: { xs: 1.5, sm: 2 },
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderLeft: { xs: '3px solid', sm: '4px solid' },
              borderLeftColor: 'secondary.light',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: 'var(--font-ultra)',
                fontWeight: 400,
                color: 'secondary.light',
                mb: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              Gambling Problem? Call GambleAlert.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2, md: 3 },
                justifyContent: { xs: 'center', sm: 'flex-start' },
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'white', textAlign: { xs: 'center', sm: 'left' } }}
              >
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
                    display: { xs: 'block', sm: 'inline' },
                  }}
                >
                  support@gamblealert.org
                </Box>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'white', textAlign: { xs: 'center', sm: 'left' } }}
              >
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
                    display: { xs: 'block', sm: 'inline' },
                    wordBreak: 'break-all',
                  }}
                >
                  https://gamblealert.org/
                </Box>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'white', textAlign: { xs: 'center', sm: 'left' } }}
              >
                Helpline: +2347058890073, +2347058890074
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            mt: { xs: 4, sm: 5, md: 6 },
            textAlign: 'center',
            borderTop: '1px solid',
            borderTopColor: 'rgba(255,255,255,0.2)',
            pt: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'var(--font-ultra)',
              fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
            }}
          >
            © 2026 All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
