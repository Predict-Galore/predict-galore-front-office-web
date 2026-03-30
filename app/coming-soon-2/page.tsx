'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowForward, Instagram, Facebook } from '@mui/icons-material';
import { FaXTwitter } from 'react-icons/fa6';
import { API_ENDPOINTS, api } from '@/shared/api';

const WAITLIST_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOCIAL_LINKS = [
  { label: 'Twitter', href: 'https://x.com', icon: <FaXTwitter size={20} /> },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com',
    icon: <Instagram sx={{ fontSize: 20 }} />,
  },
  { label: 'Facebook', href: 'https://www.facebook.com', icon: <Facebook sx={{ fontSize: 20 }} /> },
] as const;

/**
 * Coming Soon Page - Version 2
 * Grid layout matching the landing page hero section
 */
const ComingSoon2Page: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const isEmailValid = WAITLIST_EMAIL_REGEX.test(email.trim());

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!WAITLIST_EMAIL_REGEX.test(normalizedEmail)) return;

    try {
      setIsSubmitting(true);
      await api.post(API_ENDPOINTS.CONTACT.WAITLIST, { email: normalizedEmail });
      setFeedback({ severity: 'success', message: 'You joined the waitlist successfully.' });
      setEmail('');
    } catch {
      setFeedback({
        severity: 'error',
        message: 'Unable to join waitlist right now. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          // background:
          //   'linear-gradient(135deg, var(--theme-secondary-main) 0%, var(--theme-primary-dark) 100%)',
          background:
            'linear-gradient(135deg, var(--theme-primary-dark) 0%, var(--theme-secondary-main) 100%)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 12, lg: 0 },
        }}
      >
        {/* Decorative background overlay for texture */}
        {/* <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.12,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, transparent 3px),
              radial-gradient(circle at 80% 0%, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 2px, transparent 3px)
            `,
            backgroundSize: '220px 220px',
            backgroundRepeat: 'repeat',
            pointerEvents: 'none',
          }}
        /> */}

        <Box
          sx={{
            px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
            mx: 0,
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: { xs: 8, lg: 2 },
              alignItems: 'center',
            }}
          >
            {/* Left Side - Content */}
            <Box sx={{ color: 'white', textAlign: { xs: 'center', lg: 'left' } }}>
              {/* Logo */}
              <Box sx={{ mb: { xs: 6, lg: 4 } }}>
                <Image
                  src="/predict-galore-logo.png"
                  alt="Predict Galore"
                  width={500}
                  height={500}
                  priority
                  quality={100}
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </Box>

              {/* Heading */}
              <Typography
                variant="h1"
                sx={{
                  mb: 3,
                  color: 'white',
                  lineHeight: 1.1,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                A Smarter Sports{' '}
                <Box component="span" sx={{ color: theme.palette.primary.main }}>
                  Experience
                </Box>{' '}
                is
                <br />
                <Box component="span" sx={{ color: theme.palette.primary.main }}>
                  Coming Soon
                </Box>{' '}
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  mb: 5,
                  color: alpha('#fff', 0.9),
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  maxWidth: '900px',
                  mx: { xs: 'auto', lg: 0 },
                }}
              >
                We are preparing the next chapter of sports predictions with richer insights, faster
                updates, and a cleaner prediction workflow built for everyday winners.
              </Typography>

              {/* Waitlist Form */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 900,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.01)',
                  },
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleJoinWaitlist}
                  sx={{
                    bgcolor: alpha('#fff', 0.08),
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${alpha('#fff', 0.15)}`,
                    borderRadius: 2,
                    p: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s',
                    '&:focus-within': {
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fff',
                        color: 'black',
                        '& fieldset': {
                          border: 'none',
                        },
                        '& input': {
                          px: 3,
                          py: 2,
                          fontWeight: 500,
                          '&::placeholder': {
                            color: alpha('#fff', 0.4),
                            opacity: 1,
                          },
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!isEmailValid || isSubmitting}
                    endIcon={
                      isSubmitting ? null : <ArrowForward sx={{ fontSize: '1rem !important' }} />
                    }
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: '#fff',
                      fontWeight: 600,
                      px: 4,
                      py: 2,
                      borderRadius: 1,
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        bgcolor: '#10b981',
                      },
                      '&:active': {
                        transform: 'scale(0.95)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={20} sx={{ color: '#fff' }} />
                    ) : (
                      'Join Waitlist'
                    )}
                  </Button>
                </Box>
              </Box>

              <Typography
                sx={{
                  mt: 2,
                  fontSize: '0.75rem',
                  color: alpha('#fff', 0.7),
                }}
              >
                Be the first to know when we launch. No spam, just updates.
              </Typography>

              {/* Footer */}
              <Stack
                direction="row"
                justifyContent={{ xs: 'center', lg: 'flex-start' }}
                alignItems="center"
                gap={32}
                sx={{ mt: { xs: 8, lg: 12 } }}
              >
                <Stack direction="row" spacing={3}>
                  {SOCIAL_LINKS.map((social) => (
                    <IconButton
                      key={social.label}
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      sx={{
                        color: alpha('#fff', 0.8),
                        '&:hover': {
                          color: '#fff',
                        },
                        transition: 'color 0.3s',
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: alpha('#fff', 0.7),
                    display: { xs: 'none', lg: 'block' },
                  }}
                >
                  © 2024 Predict Galore. All rights reserved.
                </Typography>
              </Stack>
            </Box>

            {/* Right Side - Phone Mockup with Stats Cards */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '400px', sm: '550px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.2))',
              }}
            >
              {/* Background Phone Mockup */}
              <Image
                src="/landing-page/phone-mockup-hero.png"
                alt="Predict Galore Mobile App Mockup"
                fill
                sizes="(max-width: 768px) 400px, (max-width: 1024px) 550px, 800px"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                priority
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setFeedback(null)} severity={feedback?.severity} variant="filled">
          {feedback?.message ?? ''}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ComingSoon2Page;
