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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ArrowForward, Instagram, Facebook } from '@mui/icons-material';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';
import { API_ENDPOINTS, api } from '@/shared/api';
import { getFriendlyErrorMessage, isApiError } from '@/shared/lib/errors';

const WAITLIST_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WAITLIST_SOURCE = 'coming-soon';

type WaitlistResponse = {
  success: boolean;
  message: string;
  position: number;
};

const SOCIAL_LINKS = [
  { label: 'Twitter', href: 'https://twitter.com/PredictGalore', kind: 'x' },
  { label: 'TikTok', href: 'https://tiktok.com/@predict.galore', kind: 'tiktok' },
  { label: 'Instagram', href: 'https://instagram.com/PredictGalore', kind: 'instagram' },
  { label: 'Facebook', href: 'https://facebook.com/PredictGalore', kind: 'facebook' },
] as const;

/**
 * Coming Soon Page
 * Centered design with gradient background and glass-morphism effects
 */
const ComingSoonPage: React.FC = () => {
  const theme = useTheme();
  const isTabletUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isDesktopUp = useMediaQuery(theme.breakpoints.up('md'));

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const isNameValid = name.trim().length > 0;
  const isEmailValid = WAITLIST_EMAIL_REGEX.test(email.trim());

  const socialIconSize = isDesktopUp ? 44 : isTabletUp ? 36 : 28;

  const renderSocialIcon = (kind: (typeof SOCIAL_LINKS)[number]['kind']) => {
    switch (kind) {
      case 'x':
        return <FaXTwitter size={socialIconSize} />;
      case 'tiktok':
        return <FaTiktok size={socialIconSize} />;
      case 'instagram':
        return <Instagram sx={{ fontSize: socialIconSize + 4 }} />;
      case 'facebook':
        return <Facebook sx={{ fontSize: socialIconSize + 4 }} />;
      default:
        return null;
    }
  };

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
        throw new Error(
          response?.message || 'Unable to join waitlist right now. Please try again.'
        );
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
          minHeight: { xs: '100dvh', md: '100vh' },
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, var(--theme-secondary-main) 0%, var(--theme-primary-dark) 100%)',
          color: '#fff',
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'relative',
          py: { xs: 5, sm: 7, md: 8 },
        }}
      >
        <Box
          component="section"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, sm: 3, md: 4 },
            textAlign: 'center',
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          <Stack spacing={{ xs: 3, sm: 4, md: 4.5 }} alignItems="center" sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', maxWidth: { xs: 260, sm: 360, md: 460, lg: 560 } }}>
              <Image
                src="/predict-galore-logo.png"
                alt="Predict Galore"
                width={800}
                height={800}
                priority
                quality={100}
                sizes="(max-width: 600px) 260px, (max-width: 900px) 360px, (max-width: 1200px) 460px, 560px"
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: '2.25rem',
                  sm: '3rem',
                  md: '4rem',
                  lg: '5.25rem',
                  xl: '6.25rem',
                },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                px: { xs: 0, sm: 1 },
              }}
            >
              A Smarter Sports
              <br />
              Experience is Coming Soon
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem', lg: '1.75rem' },
                lineHeight: { xs: 1.6, md: 1.75 },
                color: '#fff',
                maxWidth: 920,
                mx: 'auto',
                fontWeight: 400,
                px: { xs: 0.5, sm: 0 },
              }}
            >
              We are preparing the next chapter of sports predictions with richer insights, faster
              updates, and a cleaner prediction workflow built for everyday winners.
            </Typography>

            <Box
              sx={{
                pt: { xs: 2.5, sm: 3.5, md: 4 },
                width: '100%',
                maxWidth: 900,
                mx: 'auto',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.01)' },
                '@media (hover: none)': { '&:hover': { transform: 'none' } },
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
                    borderColor: alpha(theme.palette.primary.main, 0.6),
                  },
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    border: `1px solid ${alpha('#fff', 0.18)}`,
                    bgcolor: alpha('#000', 0.12),
                    transition: 'border-color 0.2s, background-color 0.2s',
                  }}
                >
                  <Box
                    sx={{
                      flex: { xs: '1 1 auto', sm: '0 0 260px' },
                      minWidth: 0,
                      bgcolor: alpha('#000', 0.06),
                      transition: 'background-color 0.2s',
                      '&:focus-within': { bgcolor: alpha('#000', 0.14) },
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="standard"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      autoComplete="name"
                      InputProps={{ disableUnderline: true }}
                      sx={{
                        '& .MuiInputBase-root': { color: '#fff' },
                        '& .MuiInputBase-input': {
                          px: 3,
                          py: 2,
                          fontWeight: 500,
                          '&::placeholder': { color: alpha('#fff', 0.85), opacity: 1 },
                        },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      borderLeft: { xs: 'none', sm: `1px solid ${alpha('#fff', 0.18)}` },
                      borderTop: { xs: `1px solid ${alpha('#fff', 0.18)}`, sm: 'none' },
                      bgcolor: alpha('#000', 0.04),
                      transition: 'background-color 0.2s',
                      '&:focus-within': { bgcolor: alpha('#000', 0.12) },
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="standard"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      autoComplete="email"
                      InputProps={{ disableUnderline: true }}
                      sx={{
                        '& .MuiInputBase-root': { color: '#fff' },
                        '& .MuiInputBase-input': {
                          px: 3,
                          py: 2,
                          fontWeight: 500,
                          '&::placeholder': { color: alpha('#fff', 0.85), opacity: 1 },
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isNameValid || !isEmailValid || isSubmitting}
                  endIcon={isSubmitting ? null : <ArrowForward sx={{ fontSize: '1rem !important' }} />}
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    fontWeight: 600,
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: 1.5,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: '#10b981' },
                    '&:active': { transform: 'scale(0.95)' },
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
                  fontSize: { xs: '0.875rem', sm: '0.95rem' },
                  color: '#fff',
                  fontWeight: 500,
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                Be the first to know when we launch.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box
          component="footer"
          sx={{
            width: '100%',
            maxWidth: 1152,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 6 },
            pb: { xs: 4, md: 6 },
            pt: { xs: 4, md: 6 },
          }}
        >
          <Box sx={{ width: '100%', height: 1, mb: 4, bgcolor: alpha('#fff', 0.18) }} />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            spacing={3}
          >
            <Typography
              sx={{
                color: '#fff',
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                fontWeight: 500,
                letterSpacing: '0.04em',
                textAlign: { xs: 'center', md: 'left' },
                lineHeight: 1.4,
              }}
            >
              © 2026 PREDICT GALORE. ALL RIGHTS RESERVED.
            </Typography>

            <Stack direction="row" spacing={{ xs: 2.5, sm: 3, md: 4 }}>
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
                    '&:hover': { color: theme.palette.primary.main },
                    transition: 'color 0.3s',
                  }}
                >
                  {renderSocialIcon(social.kind)}
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>

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

export default ComingSoonPage;
