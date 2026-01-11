/**
 * 404 NOT FOUND PAGE - SIMPLE VERSION
 *
 * Clean, professional 404 page with minimal animations.
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Container } from '@mui/material';
import { Home, ArrowBack, SportsScore } from '@mui/icons-material';

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 4,
        px: 2,
      }}
    >
      {/* Error Code */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '8rem', sm: '10rem', md: '12rem' },
            fontWeight: 900,
            background: 'linear-gradient(45deg, #16a34a 30%, #2563eb 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        {/* Sports Icon */}
        <SportsScore
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: { xs: '3rem', md: '4rem' },
            opacity: 0.1,
            color: 'primary.main',
          }}
        />
      </Box>

      {/* Title */}
      {/* <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          mb: 2,
        }}
      >
        Page Not Found
      </Typography> */}

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          maxWidth: '500px',
          mb: 4,
          lineHeight: 1.6,
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Please check the URL
        or navigate back to the homepage.
      </Typography>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Link href="/" passHref legacyBehavior>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Home />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Back to Home
          </Button>
        </Link>

        <Button
          variant="outlined"
          color="secondary"
          size="large"
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            borderWidth: 2,
          }}
        >
          Go Back
        </Button>
      </Box>

      {/* Help Text */}
      <Typography
        variant="body2"
        sx={{
          color: 'text.disabled',
          mt: 4,
        }}
      >
        Need help?{' '}
        <Link
          href="/contact"
          style={{
            color: 'inherit',
            textDecoration: 'underline',
          }}
        >
          Contact support
        </Link>
      </Typography>
    </Container>
  );
}
