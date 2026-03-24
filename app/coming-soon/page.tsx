'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { API_ENDPOINTS, api } from '@/shared/api';
import { Facebook, Instagram } from '@mui/icons-material';
import { FaTiktok, FaXTwitter } from 'react-icons/fa6';

const WAITLIST_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOCIAL_LINKS = [
  { label: 'Twitter', href: 'https://x.com', icon: <FaXTwitter size={30} /> },
  { label: 'TikTok', href: 'https://www.tiktok.com', icon: <FaTiktok size={30} /> },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com',
    icon: <Instagram sx={{ fontSize: 30 }} />,
  },
  { label: 'Facebook', href: 'https://www.facebook.com', icon: <Facebook sx={{ fontSize: 30 }} /> },
] as const;

const ComingSoonPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const isEmailValid = useMemo(() => WAITLIST_EMAIL_REGEX.test(email.trim()), [email]);

  const openWaitlistDialog = () => setIsDialogOpen(true);
  const closeWaitlistDialog = () => {
    if (isSubmitting) return;
    setIsDialogOpen(false);
  };

  const handleJoinWaitlist = async () => {
    const normalizedEmail = email.trim();
    if (!WAITLIST_EMAIL_REGEX.test(normalizedEmail)) return;

    try {
      setIsSubmitting(true);
      await api.post(API_ENDPOINTS.CONTACT.WAITLIST, { email: normalizedEmail });
      setFeedback({ severity: 'success', message: 'You joined the waitlist successfully.' });
      setEmail('');
      setIsDialogOpen(false);
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
        component="section"
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, var(--theme-secondary-main) 0%, var(--theme-primary-dark) 100%)',
          // background: 'linear-gradient(180deg, #22733d 0%, #b33533 50%, #22733d 100%)',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container disableGutters maxWidth={false} sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              py: { xs: 5, sm: 6, md: 7 },
              px: { xs: 3, sm: 5, md: 7 },
              textAlign: 'center',
            }}
          >
            <Stack alignItems="center">
              <Stack spacing={{ xs: 3 }} alignItems="center" sx={{ width: '100%' }}>
                <Box>
                  <Image
                    src="/predict-galore-logo.png"
                    alt="Predict Galore"
                    width={400}
                    height={400}
                    priority
                    quality={100}
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    color: '#fff',
                    fontWeight: 800,
                    lineHeight: { xs: 1.2, md: 1.1 },
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '6rem' },
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  A Smarter Sports
                  <br />
                  Experience is Coming Soon
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#fff',
                    maxWidth: 900,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                    lineHeight: 1.6,
                    fontWeight: 400,
                    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  We are preparing the next chapter of sports predictions with richer insights,
                  faster updates, and a cleaner prediction workflow built for everyday winners.
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
                >
                  <Button
                    onClick={openWaitlistDialog}
                    variant="contained"
                    size="large"
                    sx={{
                      minWidth: { sm: 200 },
                      bgcolor: '#fff',
                      color: '#1a1a1a',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 1,
                      py: 1.75,
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      '&:hover': { bgcolor: '#f2f2f2' },
                    }}
                  >
                    Join Waitlist
                  </Button>
                </Stack>
              </Stack>

              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={3}
                sx={{
                  mt: 12,
                  pt: 1.5,
                }}
              >
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
                      border: `1px solid ${alpha('#fff', 0.4)}`,
                      bgcolor: alpha('#fff', 0.08),
                      '&:hover': { bgcolor: alpha('#fff', 0.16), borderColor: alpha('#fff', 0.8) },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeWaitlistDialog} fullWidth maxWidth="xs">
        <DialogTitle component="div">Join the Waitlist</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Enter your email address to receive launch updates.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={email.length > 0 && !isEmailValid}
              helperText={email.length > 0 && !isEmailValid ? 'Enter a valid email address.' : ' '}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeWaitlistDialog}
            disabled={isSubmitting}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoinWaitlist}
            variant="contained"
            disabled={!isEmailValid || isSubmitting}
            sx={{
              textTransform: 'none',
              minWidth: 120,
            }}
          >
            {isSubmitting ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Join'}
          </Button>
        </DialogActions>
      </Dialog>

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
