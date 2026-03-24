'use client';

import React, { useState } from 'react';
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
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';
import { API_ENDPOINTS, api } from '@/shared/api';
import { getFriendlyErrorMessage, isApiError } from '@/shared/lib/errors';
import Image from 'next/image';

const WAITLIST_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WAITLIST_SOURCE = 'coming-soon-3';

type WaitlistResponse = {
  success: boolean;
  message: string;
  position: number;
};

const SOCIAL_LINKS = [
  { label: 'Twitter', href: 'https://twitter.com/PredictGalore', icon: <FaXTwitter size={50} /> },
  { label: 'TikTok', href: 'https://tiktok.com/@predict.galore', icon: <FaTiktok size={50} /> },
  {
    label: 'Instagram',
    href: 'https://instagram.com/PredictGalore',
    icon: <Instagram sx={{ fontSize: 55 }} />,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/PredictGalore',
    icon: <Facebook sx={{ fontSize: 55 }} />,
  },
] as const;

/**
 * Coming Soon Page - Version 3
 * Centered design with gradient background and glass-morphism effects
 */
const ComingSoon3Page: React.FC = () => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const isNameValid = name.trim().length > 0;
  const isEmailValid = WAITLIST_EMAIL_REGEX.test(email.trim());

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    if (!normalizedName || !WAITLIST_EMAIL_REGEX.test(normalizedEmail)) return;

    try {
      setIsSubmitting(true);
      const response = await api.post<WaitlistResponse>(API_ENDPOINTS.CONTACT.WAITLIST_PUBLIC, {
        email: normalizedEmail,
        name: normalizedName,
        source: WAITLIST_SOURCE,
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Unable to join waitlist right now. Please try again.');
      }

      const positionText =
        typeof response.position === 'number' && response.position > 0
          ? ` (Position #${response.position})`
          : '';

      setFeedback({
        severity: 'success',
        message: `${response.message || 'You joined the waitlist successfully.'}${positionText}`,
      });
      setName('');
      setEmail('');
    } catch (error) {
      const message =
        isApiError(error) && (error.status === 400 || error.status === 409)
          ? error.message
          : getFriendlyErrorMessage(error, 'Unable to join waitlist right now. Please try again.');
      setFeedback({
        severity: 'error',
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, var(--theme-secondary-main) 0%, var(--theme-primary-dark) 100%)',
          color: '#fff',
          overflow: 'hidden',
          position: 'relative',
          pt: { xs: 12, lg: 0 },
        }}
      >
        {/* Main Content */}
        <Box
          component="section"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 3,
            textAlign: 'center',
            pt: 12,
            pb: 6,
          }}
        >
          <Stack spacing={4} alignItems="center">
            <Image
              src="/predict-galore-logo.png"
              alt="Predict Galore"
              width={800}
              height={800}
              priority
              quality={100}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '900px',
                objectFit: 'contain',
              }}
            />

            {/* Heading  */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '8rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              A Smarter Sports
              <br />
              Experience is Coming Soon
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                fontSize: { xs: '1.125rem', md: '2rem' },
                lineHeight: 1.75,
                color: '#fff',
                maxWidth: 950,
                mx: 'auto',
                fontWeight: 300,
              }}
            >
              We are preparing the next chapter of sports predictions with richer insights, faster
              updates, and a cleaner prediction workflow built for everyday winners.
            </Typography>

            {/* Waitlist Form */}
            <Box
              sx={{
                pt: 4,
                width: '100%',
                maxWidth: 900,
                mx: 'auto',
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
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
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
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="name"
                  sx={{
                    flex: { xs: '1 1 auto', sm: '0 0 240px' },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'transparent',
                      color: '#fff',
                      '& fieldset': {
                        border: 'none',
                      },
                      '& input': {
                        px: 3,
                        py: 2,
                        fontWeight: 500,
                        '&::placeholder': {
                          color: '#fff',
                          opacity: 1,
                        },
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="email"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'transparent',
                      color: '#fff',
                      '& fieldset': {
                        border: 'none',
                      },
                      '& input': {
                        px: 3,
                        py: 2,
                        fontWeight: 500,
                        '&::placeholder': {
                          color: '#fff',
                          opacity: 1,
                        },
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isNameValid || !isEmailValid || isSubmitting}
                  endIcon={
                    isSubmitting ? null : <ArrowForward sx={{ fontSize: '1rem !important' }} />
                  }
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    fontWeight: 600,
                    px: 4,
                    py: 2,
                    borderRadius: 1.5,
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

              <Typography
                sx={{
                  mt: 2,
                  fontSize: '0.875rem',
                  color: '#fff',
                  fontWeight: 500,
                  textAlign: 'left',
                }}
              >
                Be the first to know when we launch.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            width: '100%',
            maxWidth: 1152,
            px: { xs: 3, md: 6 },
            pb: 6,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 1,
              mb: 4,
            }}
          />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            spacing={3}
          >
            <Typography
              sx={{
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
              }}
            >
              © 2026 PREDICT GALORE. ALL RIGHTS RESERVED.
            </Typography>

            <Stack direction="row" spacing={4}>
              {SOCIAL_LINKS.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: '#fff',
                    p: 0.5,
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                    transition: 'color 0.3s',
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>
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

export default ComingSoon3Page;
