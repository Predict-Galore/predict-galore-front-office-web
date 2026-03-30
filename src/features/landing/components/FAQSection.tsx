'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Link as MuiLink,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { alpha } from '@mui/material/styles';

const FAQSection: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      id: '1',
      question: 'What is Predict Galore?',
      answer:
        'Predict Galore is a sports betting prediction platform, powered by AI-driven statistics and deep analyses from our expert analysts. Predict Galore works like a personal prediction adviser on your preferred gadget, helping you forecast sports outcomes, and carefully select potential outcomes based on recommended tips by our expert analysts, to ensure consistent winnings overtime. It also allows you to curate your profile to follow more intimately your preferred sports clubs and athletes, ensuring even deeper knowledge and information accessibility than the average sports fan.',
    },
    {
      id: '2',
      question: 'What kind of prediction tips do I get with Predict Galore?',
      answer:
        'Predict Galore is the only sports betting prediction platform that allows you to use critically analysed all popular market types, reference them against their potential odds, extensively explain the reason(s) informing our expert analysts’ prediction tip decisions, and project the estimated chances of those outcomes. Popular markets such as 1X2, DOUBLE CHANCE, OVER/UNDER, GOAL/NO GOAL, HALF-TIME/FULL TIME, CORRECT SCORE, GG/NG, TOTAL GOALS (EXACT), FIRST TEAM TO SCORE, and OWN GOAL are prediction tips readily available on Predict Galore. Unpopular and yet extremely rewarding super markets such as ANY PLAYERS (First Goalscorer, Anytime Goalscorer, Last Goalscorer, N. Goalscorer), Shots Over/Under, Anytime goalscorer + Assist, Anytime Goalscorer or Assist etc. are also regularly featured.',
    },
    {
      id: '3',
      question: 'Do I need to pay to use Predict Galore?',
      answer:
        'Predict Galore offers betting prediction tips that are readily available for free. Predict Galore’s premium plan offers more detailed insights on betting prediction tips and market types.',
    },
    {
      id: '4',
      question: 'How do I get started?',
      answer: 'Simply sign up and access prediction tips directly from your dashboard.',
    },
    {
      id: '5',
      question: 'How can I put my favourite clubs and players at the top of my screen?',
      answer:
        'Tap the Follow button on any league club or player to move it into the top section of your Profile. News feeds and updates will automatically appear at the top of your profile.',
    },
    {
      id: '6',
      question: 'Where do the predictions come from?',
      answer:
        'Predictions are made by expert analysts who intensively study, analyse, and predict betting outcomes from data generated using Artificial Intelligence models trained on sports data and trends.',
    },
    {
      id: '7',
      question: 'Can I use Predict Galore for betting?',
      answer:
        'No. Predict Galore is for educational and analytical use. By providing data through betting prediction tips, users can rely on Predict Galore to make informed betting decisions, and afterwards, use the recommended tips to bet on whatever betting platforms and sports of their choice. Users cannot place bets on Predict Galore.',
    },
    {
      id: '8',
      question: 'What happens if I forget my login details?',
      answer: 'You can easily reset your password using the ‘Forgot Password?’ link.',
    },
    {
      id: '9',
      question: 'Which devices can I use Predict Galore on?',
      answer: 'Predict Galore works perfectly on phones, tablets, and computers.',
    },
    {
      id: '10',
      question: 'How is Predict Galore Regulated?',
      answer:
        'Predict Galore is registered in Nigeria. Our betting prediction platform also has a certificate of registration in accordance with the Special Control Unit Against Money Laundering (SCUML) which is regulated by the EFCC.',
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        py: { xs: 6, sm: 8, md: 10, lg: 12 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Section Header */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 5, sm: 6, md: 7, lg: 8 },
            maxWidth: { sm: '90%', md: '80%', lg: '70%' },
            mx: 'auto',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#0f172a',
              mb: { xs: 1.5, sm: 2, md: 2.5 },
              fontSize: {
                xs: '1.75rem',
                sm: '2rem',
                md: '2.5rem',
                lg: '3rem',
              },
              fontWeight: { xs: 700, md: 800 },
              lineHeight: 1.2,
            }}
          >
            Got Questions?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#475569',
              maxWidth: { xs: '100%', md: '600px' },
              mx: 'auto',
              fontSize: {
                xs: '0.95rem',
                sm: '1rem',
                md: '1.1rem',
              },
              lineHeight: 1.6,
              px: { xs: 2, sm: 0 },
            }}
          >
            Everything you need to know before getting started with Predict Galore.
          </Typography>
        </Box>

        {/* FAQ Accordions */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            maxWidth: '900px',
            mx: 'auto',
          }}
        >
          {faqs.map((faq) => (
            <Accordion
              key={faq.id}
              expanded={expanded === faq.id}
              onChange={handleChange(faq.id)}
              disableGutters
              elevation={0}
              sx={{
                border: `1px solid ${alpha('#e2e8f0', expanded === faq.id ? 1 : 0.8)}`,
                borderRadius: { xs: '6px !important', sm: '8px !important' },
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: expanded === faq.id ? '#42A605' : alpha('#42A605', 0.5),
                  bgcolor: alpha('#f8fafc', 0.7),
                },
                '&:before': { display: 'none' },
                ...(expanded === faq.id && {
                  borderColor: '#42A605',
                  boxShadow: `0 4px 20px ${alpha('#e2e8f0', 0.8)}`,
                }),
              }}
            >
              <AccordionSummary
                expandIcon={
                  <AddCircleOutlineIcon
                    sx={{
                      color: expanded === faq.id ? '#42A605' : '#0f172a',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: expanded === faq.id ? 'rotate(45deg)' : 'none',
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    }}
                  />
                }
                sx={{
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 0.5, sm: 0.75, md: 1 },
                  minHeight: { xs: 56, sm: 64, md: 72 },
                  '& .MuiAccordionSummary-content': {
                    my: { xs: 1.5, sm: 1.75, md: 2 },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: { xs: 600, md: 700 },
                    color: expanded === faq.id ? '#42A605' : '#0f172a',
                    fontSize: {
                      xs: '0.95rem',
                      sm: '1rem',
                      md: '1.1rem',
                      lg: '1.15rem',
                    },
                    lineHeight: 1.4,
                    pr: { xs: 1, sm: 2 },
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: { xs: 2, sm: 3, md: 4 },
                  pb: { xs: 3, sm: 3.5, md: 4 },
                  pt: { xs: 0.5, sm: 1, md: 1.5 },
                }}
              >
                <Typography
                  sx={{
                    color: '#475569',
                    lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
                    fontSize: {
                      xs: '0.875rem',
                      sm: '0.9rem',
                      md: '0.95rem',
                      lg: '1rem',
                    },
                    textAlign: 'left',
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Footer Contact Info */}
        <Box
          sx={{
            mt: { xs: 6, sm: 8, md: 10 },
            textAlign: 'center',
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: 3, sm: 4 },
            bgcolor: '#f8fafc',
            border: `1px dashed ${alpha('#e2e8f0', 0.8)}`,
            maxWidth: '700px',
            mx: 'auto',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: { xs: 700, md: 800 },
              mb: { xs: 1, sm: 1.25, md: 1.5 },
              color: '#0f172a',
              fontSize: {
                xs: '1.1rem',
                sm: '1.2rem',
                md: '1.3rem',
              },
            }}
          >
            Still have questions?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#475569',
              mb: { xs: 2, sm: 2.5, md: 3 },
              fontSize: {
                xs: '0.875rem',
                sm: '0.9rem',
                md: '0.95rem',
              },
              lineHeight: 1.6,
              px: { xs: 2, sm: 0 },
            }}
          >
            Do you have a question, request, issue, or comment that is not covered here?
          </Typography>
          <MuiLink
            href="mailto:customerservice@predictgalore.com"
            sx={{
              color: '#42A605',
              fontWeight: { xs: 600, sm: 700 },
              fontSize: {
                xs: '0.9rem',
                sm: '0.95rem',
                md: '1rem',
                lg: '1.1rem',
              },
              textDecoration: 'none',
              display: 'inline-block',
              wordBreak: 'break-all', // Prevents email from overflowing on mobile
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            customerservice@predictgalore.com
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQSection;
