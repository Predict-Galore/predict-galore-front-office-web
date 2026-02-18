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
      // Themed Semantic colors
      colorToken: '#e72838',
      phoneImage: IMAGES.LANDING.FEATURE_INSIGHTS,
      bgColor: 'rgba(245, 119, 126, 0.05)',
    },
    {
      id: 'live',
      title: 'Live Game Centre ',
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
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 8, md: 12 } }}>
        <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          mx: 0,
          flex: 1,
        }}
      >
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <Typography
            variant="h2"
            sx={{
              color: '#0f172a',
              mb: 3,
            }}
          >
            Everything sports, all in one place
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#475569',
              maxWidth: '800px',
              margin: '0 auto',
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
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 4,
          }}
        >
          {features.map((feature) => (
            <Box
              key={feature.id}
              sx={{
                bgcolor: feature.bgColor,
                borderRadius: '32px',
                p: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
                  borderColor: feature.colorToken,
                  bgcolor: alpha(feature.bgColor, 0.08),
                },
              }}
            >
              {/* Content Top */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: feature.colorToken,
                    mb: 2,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#475569',
                    mb: 4,
                    lineHeight: 1.6,
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
                    gap: 1.5,
                    color: feature.colorToken,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      '& span': { transform: 'translateX(6px)' },
                    },
                  }}
                >
                  {feature.cta}
                  <Box component="span" sx={{ transition: 'transform 0.3s' }}>
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
                  pt: 4,
                  height: { xs: '300px', md: '400px' },
                }}
              >
                <Image
                  src={feature.phoneImage}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 768px) 300px, 400px"
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                  unoptimized
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
