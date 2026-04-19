'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import { Instagram, Facebook } from '@mui/icons-material';
import NextLink from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/shared/constants/images';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';

const Footer: React.FC = () => {
  const socialLinks = [
    { label: 'Twitter', href: 'https://twitter.com/PredictGalore', kind: 'x' },
    { label: 'TikTok', href: 'https://tiktok.com/@predict.galore', kind: 'tiktok' },
    { label: 'Instagram', href: 'https://instagram.com/PredictGalore', kind: 'instagram' },
    { label: 'Facebook', href: 'https://facebook.com/PredictGalore', kind: 'facebook' },
  ] as const;

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
        px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
      }}
    >
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
              src={IMAGES.LOGO.MAIN}
              alt="Predict Galore"
              width={180}
              height={40}
              style={{ objectFit: 'contain' }}
              unoptimized
            />
          </Box>
          <Typography variant="body1" sx={{ color: 'white', mb: 4, fontWeight: 400 }}>
            Smart predictions. Smarter choices.
          </Typography>

          {/* Social Icons */}
          <Stack direction="row" spacing={1.5}>
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                component="a"
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                sx={{
                  bgcolor: alpha('#fff', 0.1),
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: alpha('#fff', 0.2) },
                }}
              >
                {social.kind === 'x' ? (
                  <FaXTwitter size={18} />
                ) : social.kind === 'tiktok' ? (
                  <FaTiktok size={18} />
                ) : social.kind === 'instagram' ? (
                  <Instagram fontSize="small" />
                ) : (
                  <Facebook fontSize="small" />
                )}
              </IconButton>
            ))}
          </Stack>
        </Box>

        {/* Navigation Sections */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 4, md: 2 },
          }}
        >
          {/* PRODUCT column (disabled for now) */}
          {/*
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
          */}

          {/* SUPPORT */}
          <Box>
            <Typography sx={headerStyle}>SUPPORT</Typography>
            <Stack spacing={1.5}>
              <Link component={NextLink} href="/#faq" sx={linkStyle}>
                FAQs
              </Link>
              <Link component={NextLink} href="/contact-us#contact-form" sx={linkStyle}>
                Contact Us
              </Link>
            </Stack>
          </Box>

          {/* LEGAL */}
          <Box>
            <Typography sx={headerStyle}>LEGAL</Typography>
            <Stack spacing={1.5}>
              <Link
                component={NextLink}
                href="/docs/predict-galore-privacy-policy.pdf"
                sx={linkStyle}
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
              <Link
                component={NextLink}
                href="/docs/predict-galore-terms-of-use.pdf"
                sx={linkStyle}
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use
              </Link>
              <Link
                component={NextLink}
                href="/docs/predict-galore-cookie-policy.pdf"
                sx={linkStyle}
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookie Policy
              </Link>
            </Stack>
          </Box>

          {/* CONTACT */}
          <Box>
            <Typography sx={headerStyle}>CONTACT</Typography>
            <Stack spacing={1.5}>
              <Link
                href="mailto:customerservice@predictgalore.com"
                sx={{ ...linkStyle, wordBreak: 'break-all' }}
              >
                customerservice@predictgalore.com
              </Link>
              <Typography sx={{ ...linkStyle, cursor: 'default' }}>+2349068192247</Typography>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Responsible Gambling Notice - Full width below content */}
      <Box
        sx={{
            background: 'linear-gradient(135deg, #1C4602 0%, #2d6a04 100%)',
          p: { xs: 3, md: 3 },
        borderRadius: { xs: 3, sm: 4 },
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
          </Box>
          <Box component="span">
            <Box component="span" sx={{ color: '#4AA900', fontWeight: 700 }}>
              Predict
            </Box>{' '}
            <Box component="span" sx={{ color: '#e72838', fontWeight: 700 }}>
              Galore
            </Box>
            . All rights reserved.
          </Box>
          <Box
            component="span"
            aria-label="18 plus"
            sx={{
              ml: 0.5,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 18,
              borderRadius: '999px',
              border: `1px solid ${alpha('#fff', 0.65)}`,
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            18+
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
