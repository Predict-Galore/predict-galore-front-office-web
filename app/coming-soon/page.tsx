// app/(public)/coming-soon/page.tsx
'use client';

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupsIcon from '@mui/icons-material/Groups';
// import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LaunchIcon from '@mui/icons-material/Launch';

const ComingSoonPage: React.FC = () => {

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFFBFB' }}>
      {/* ==================== HERO SECTION (TWO COLUMN LAYOUT) ==================== */}
      {/* ==================== HERO SECTION (TWO COLUMN LAYOUT) ==================== */}
      <Box
        component="section"
        sx={{
          background: 'url(/assets/landing-page/hero/hero-bg.png), linear-gradient(135deg, #1976d2 0%, #dc004e 100%) center/cover no-repeat',
          backgroundBlendMode: 'overlay',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', lg: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 8, lg: 16 },
          }}
        >
          {/* Left Text Section */}
          <Box
            sx={{
              width: { lg: '50%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {/* Coming Soon Badge */}
            <Chip
              label="COMING SOON"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                letterSpacing: '2px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                alignSelf: 'flex-start',
                backdropFilter: 'blur(10px)',
                px: 2,
                py: 1,
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                The Future of
                <br />
                <Box component="span" sx={{ color: '#FFD700' }}>
                  Sports Predictions
                </Box>
                <br />
                Is Almost Here
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                }}
              >
                We&apos;re combining AI-powered analytics with real-time sports data to deliver
                unparalleled prediction accuracy and insights. Get ready for the ultimate sports
                experience.
              </Typography>
            </Box>

            {/* Launch Countdown */}
            {/* <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          p: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Launching Q2 2025
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
          }}
        >
          {['Days', 'Hours', 'Minutes', 'Seconds'].map((item, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#FFD700',
                }}
              >
                --
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box> */}

            {/* Notify Me Button */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              {/* <Button
          variant="contained"
          size="large"
          endIcon={<NotificationsActiveIcon />}
          sx={{
            backgroundColor: '#FFFFFF',
            color: #1976d2,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
            },
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
          }}
        >
          Notify Me on Launch
        </Button> */}
            </Box>
          </Box>

          {/* Right Mockup Image Section */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 5,
              width: { lg: '50%' },
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                maxWidth: '557px',
                width: '100%',
                height: { xs: '400px', md: '500px' },
              }}
            >
              <Image
                src="/assets/landing-page/hero/phone-mockup.png"
                alt="Predict Galore Coming Soon Preview"
                fill
                quality={100}
                priority
                style={{
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.3))',
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ==================== FEATURES PREVIEW SECTION ==================== */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            icon={<AutoAwesomeIcon />}
            label="What's Coming"
            sx={{
              bgcolor: '#C4E3B2',
              color: '#166534',
              fontWeight: 'bold',
              mb: 3,
              px: 3,
              py: 1,
            }}
          />
        </Box>

        {/* Feature Cards using Stack */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mb: 4 }}>
          {/* Row 1 - First 3 cards */}
          <Stack spacing={4} sx={{ flex: 1 }}>
            {[
              {
                icon: <SportsSoccerIcon sx={{ fontSize: 40, color: '#B91010' }} />,
                title: 'AI-Powered Predictions',
                description:
                  'Advanced machine learning algorithms analyzing thousands of data points for accurate match outcomes.',
                features: [
                  'Live match analysis',
                  'Player performance metrics',
                  'Team form tracking',
                ],
                color: '#FFF5F5',
              },
              {
                icon: <TimelineIcon sx={{ fontSize: 40, color: '#2E7D32' }} />,
                title: 'Real-Time Analytics',
                description:
                  'Stay updated with live scores, statistics, and predictive insights as games unfold.',
                features: ['Live score updates', 'In-game statistics', 'Win probability tracking'],
                color: '#F0FFF4',
              },
              {
                icon: <GroupsIcon sx={{ fontSize: 40, color: '#1976D2' }} />,
                title: 'Community & Social',
                description:
                  'Connect with fellow sports enthusiasts, share predictions, and join prediction leagues.',
                features: ['Prediction contests', 'Leaderboards', 'Social sharing'],
                color: '#F0F8FF',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  border: '1px solid #E5E5E5',
                  borderRadius: 3,
                  bgcolor: feature.color,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardContent
                  sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: 2, boxShadow: 1 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111' }}>
                      {feature.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: 3,
                      flexGrow: 1,
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1}>
                    {feature.features.map((feat, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#1976d2',
                          }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* Row 1 - Last 3 cards */}
          <Stack spacing={4} sx={{ flex: 1 }}>
            {[
              {
                icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
                title: 'Premium Insights',
                description:
                  'Exclusive advanced statistics, expert analysis, and personalized prediction models.',
                features: ['Expert commentary', 'Advanced metrics', 'Custom prediction models'],
                color: '#FFF8E1',
              },
              {
                icon: <CalendarTodayIcon sx={{ fontSize: 40, color: '#7B1FA2' }} />,
                title: 'Schedule & Tracking',
                description:
                  'Comprehensive sports calendar with reminders and personal prediction tracking.',
                features: ['Match calendars', 'Reminder system', 'Prediction history'],
                color: '#F3E5F5',
              },
              {
                icon: <LaunchIcon sx={{ fontSize: 40, color: '#D32F2F' }} />,
                title: 'Multi-Platform Access',
                description:
                  'Seamless experience across web and mobile apps with synchronized data.',
                features: ['Cross-platform sync', 'Mobile notifications', 'Progressive web app'],
                color: '#FFEBEE',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  border: '1px solid #E5E5E5',
                  borderRadius: 3,
                  bgcolor: feature.color,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardContent
                  sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: 2, boxShadow: 1 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111' }}>
                      {feature.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: 3,
                      flexGrow: 1,
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1}>
                    {feature.features.map((feat, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#1976d2',
                          }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>

      {/* ==================== MINIMAL FOOTER ==================== */}
      <Box
        sx={{
          bgcolor: '#640C0F',
          color: 'white',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2025 Predict Galore. All rights reserved. Coming Soon.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ComingSoonPage;
