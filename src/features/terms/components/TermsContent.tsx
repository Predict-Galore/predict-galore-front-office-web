'use client';

import React from 'react';
import { Box, Typography, Container, Link as MuiLink } from '@mui/material';

const TermsContent: React.FC = () => {
  const termsSections = [
    {
      number: 1,
      title: 'Introduction',
      content:
        'Welcome to Predict Galore. By accessing or using our website, mobile app, or services, you agree to these Terms of Service. Please read them carefully before using our platform.',
    },
    {
      number: 2,
      title: 'Eligibility',
      content:
        'You must be at least 18 years old (or the legal age in your jurisdiction) to use Predict Galore. By creating an account, you confirm that you meet this requirement.',
    },
    {
      number: 3,
      title: 'Use of Services',
      content:
        'Predict Galore provides sports predictions, match insights, news, and related content. The information we provide is for informational and entertainment purposes only. We are not a betting or gambling service.',
    },
    {
      number: 4,
      title: 'Accounts',
      isList: true,
      items: [
        'You are responsible for maintaining the confidentiality of your login details.',
        'You agree to provide accurate and complete information when registering.',
        'Predict Galore reserves the right to suspend or terminate accounts that violate these terms.',
      ],
    },
    {
      number: 5,
      title: 'Free and Premium Services',
      content:
        'Some features are available free of charge. Premium services require a subscription. Details of pricing, billing, and cancellation are provided at the point of purchase.',
    },
    {
      number: 6,
      title: 'Intellectual Property',
      content:
        'All content, branding, and designs on Predict Galore are owned by us or our licensors. You may not copy, modify, or redistribute without permission.',
    },
    {
      number: 7,
      title: 'Limitation of Liability',
      content:
        'We make no guarantees about prediction accuracy. You agree that Predict Galore is not liable for any financial losses, decisions, or outcomes related to use of our predictions or services.',
    },
    {
      number: 8,
      title: 'User Conduct',
      isList: true,
      content: 'You agree not to:',
      items: [
        'Misuse the platform or disrupt services.',
        'Share false or misleading information.',
        'Use Predict Galore for unlawful purposes.',
      ],
    },
    {
      number: 9,
      title: 'Termination',
      content:
        'We reserve the right to suspend or terminate accounts that violate these terms or misuse our services.',
    },
    {
      number: 10,
      title: 'Changes to Terms',
      content:
        'Predict Galore may update these Terms of Service from time to time. Continued use of our services after changes means you accept the new terms.',
    },
    {
      number: 11,
      title: 'Contact Us',
      content: 'For questions regarding these Terms, please contact us at:',
      email: 'customerservice@predictgalore.com',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {termsSections.map((section) => (
            <Box key={section.number} component="section">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {/* Visual Number Indicator */}
                <Typography
                  variant="h6"
                  sx={{
                    color: '#e72838',
                    fontWeight: 800,
                    minWidth: '24px',
                  }}
                >
                  {section.number < 10 ? `0${section.number}` : section.number}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#0f172a',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {section.title}
                </Typography>
              </Box>

              {section.content && (
                <Typography
                  variant="body1"
                  sx={{
                    color: '#475569',
                    lineHeight: 1.8,
                    mb: section.isList ? 2 : 0,
                  }}
                >
                  {section.content}
                </Typography>
              )}

              {section.isList && section.items && (
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    listStyleType: 'none',
                  }}
                >
                  {section.items.map((item, index) => (
                    <Box
                      key={index}
                      component="li"
                      sx={{
                        display: 'flex',
                        gap: 2,
                        color: '#475569',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#f5777e',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          mt: '2px',
                        }}
                      >
                        {index + 1}.
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {section.email && (
                <MuiLink
                  href={`mailto:${section.email}`}
                  sx={{
                    display: 'inline-block',
                    color: '#42A605',
                    fontWeight: 600,
                    mt: 2,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {section.email}
                </MuiLink>
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TermsContent;
