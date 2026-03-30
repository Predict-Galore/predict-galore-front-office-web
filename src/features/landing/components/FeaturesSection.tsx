'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import NextLink from 'next/link';
import { IMAGES } from '@/shared/constants/images';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 'insights',
      title: 'Intelligent Match Insights',
      description:
        'Highlights of key statistics, updates, trends, patterns, as well as breakdowns by expert analysts, so predictions are smarter and fact-based, not lucky guesses.',
      cta: 'View predictions',
      colorToken: '#e72838',
      phoneImage: IMAGES.LANDING.FEATURE_INSIGHTS,
      bgColor: 'rgba(245, 119, 126, 0.05)',
    },
    {
      id: 'live',
      title: 'Live Game Centre',
      description:
        'Stay connected to the action no matter where you are. Get real-time scores, play-by-play details, and instant notifications as games unfold. Whether it’s football, basketball, or any other sport.',
      colorToken: '#42A605',
      phoneImage: IMAGES.LANDING.FEATURE_LIVE,
      bgColor: 'rgba(92, 204, 128, 0.05)',
    },
    {
      id: 'hub',
      title: 'League & Player Hub',
      description:
        'Access detailed statistics, player performance analyses, and historical data to fuel your sports knowledge and predictions. Whether you are debating with friends or tracking your team’s progress for your betting needs, we’ve got you covered.',
      cta: 'Check Current Standings',
      colorToken: '#42A605',
      phoneImage: IMAGES.LANDING.FEATURE_HUB,
      bgColor: 'rgba(92, 204, 128, 0.03)',
    },
    {
      id: 'feed',
      title: 'Personalised Feed',
      description:
        'Personalise your experience by selecting the teams, athletes, and competitions you care about most. Your feed automatically adapts to bring you the latest highlights, news, and statistics, based on your choices—all in one place.',
      cta: 'Read Latest Updates',
      colorToken: '#e72838',
      phoneImage: IMAGES.LANDING.FEATURE_FEED,
      bgColor: 'rgba(245, 119, 126, 0.03)',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, sm: 8, md: 12 } }}>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          maxWidth: { xl: '1400px' }, // Constrain max width on very large screens
          mx: 'auto',
        }}
      >
        {/* Section Header */}
        <Box
          sx={{
            textAlign: { xs: 'center', md: 'center' },
            mb: { xs: 6, sm: 8, md: 10 },
            maxWidth: { sm: '90%', md: '80%', lg: '70%' },
            mx: 'auto',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#0f172a',
              mb: { xs: 2, sm: 2.5, md: 3 },
              fontSize: {
                xs: '1.75rem',
                sm: '2.25rem',
                md: '2.75rem',
                lg: '3.25rem',
              },
              fontWeight: { xs: 700, md: 800 },
              lineHeight: { xs: 1.2, md: 1.1 },
              textAlign: 'center',
              px: { xs: 2, sm: 0 },
            }}
          >
            Everything sports, all in one place
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#475569',
              maxWidth: { xs: '100%', md: '800px' },
              margin: '0 auto',
              fontSize: {
                xs: '0.95rem',
                sm: '1rem',
                md: '1.1rem',
                lg: '1.2rem',
              },
              lineHeight: { xs: 1.5, md: 1.6 },
              px: { xs: 2, sm: 3, md: 0 },
              textAlign: 'center',
            }}
          >
            From expert analyses to real-time updates, Predict Galore gives you the advantage
            before, during, and after the game.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            },
            gap: { xs: 3, sm: 4, md: 5 },
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={feature.id}
              sx={{
                bgcolor: feature.bgColor,
                borderRadius: { xs: '24px', sm: '28px', md: '32px' },
                p: { xs: 3, sm: 4, md: 5, lg: 6 },
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: { md: 'translateY(-8px)' },
                  boxShadow: { md: '0 24px 48px rgba(15, 23, 42, 0.08)' },
                  borderColor: feature.colorToken,
                  bgcolor: alpha(feature.bgColor, 0.08),
                },
              }}
            >
              {/* Content Top */}
              <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: feature.colorToken,
                    mb: { xs: 1.5, sm: 2, md: 2.5 },
                    fontSize: {
                      xs: '1.35rem',
                      sm: '1.5rem',
                      md: '1.65rem',
                      lg: '1.85rem',
                    },
                    lineHeight: 1.2,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#475569',
                    mb: { xs: 3, sm: 4, md: 5 },
                    lineHeight: 1.6,
                    fontSize: {
                      xs: '0.9rem',
                      sm: '0.95rem',
                      md: '1rem',
                      lg: '1.05rem',
                    },
                  }}
                >
                  {feature.description}
                </Typography>

                <Link
                  component={NextLink}
                  href="#"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.5 },
                    color: feature.colorToken,
                    fontWeight: 700,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      '& span': { transform: { md: 'translateX(6px)' } },
                    },
                  }}
                >
                  {feature.cta}
                  <Box
                    component="span"
                    sx={{
                      transition: { md: 'transform 0.3s' },
                      fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                    }}
                  >
                    →
                  </Box>
                </Link>
              </Box>

              {/* Image Container */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  mt: 'auto',
                  pt: { xs: 2, sm: 3, md: 4 },
                  height: {
                    xs: '220px',
                    sm: '280px',
                    md: '320px',
                    lg: '380px',
                    xl: '400px',
                  },
                  '& img': {
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                  '&:hover img': {
                    transform: { md: 'scale(1.05)' },
                  },
                }}
              >
                <Image
                  src={feature.phoneImage}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, (max-width: 1024px) 320px, (max-width: 1280px) 380px, 400px"
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                  unoptimized
                  priority={index < 2} // Load first two images with priority
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
