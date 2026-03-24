/**
 * Contact Form Component
 * Feature component for contact form
 */

'use client';

import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Paper,
  Snackbar,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import { Button } from '@/shared/components/ui';
import { Send, Error as ErrorIcon, Phone, Email, AccessTime } from '@mui/icons-material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema } from '../validations/schemas';
import type { ContactFormData } from '../model/types';
import { useSubmitContactForm } from '../api/hooks';
import { CONTACT_CONSTANTS } from '../lib/constants';
import { createLogger } from '@/shared/api/logger';

const logger = createLogger('ContactForm');

const ContactForm: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [localError, setLocalError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    mutate: submitContactForm,
    isPending: isFormSubmitting,
    reset: resetContactFormMutation,
  } = useSubmitContactForm();

  const { control, handleSubmit, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      phoneNumber: '',
    },
    mode: 'onBlur',
  });

  const handleFormSubmission: SubmitHandler<ContactFormData> = async (
    formData: ContactFormData
  ) => {
    try {
      setLocalError(null);
      logger.debug('Contact form submitted', { email: formData.email });

      submitContactForm(formData, {
        onSuccess: () => {
          logger.info('Contact form submitted successfully');
          setSuccess(true);
          reset();
          setTimeout(() => {
            setSuccess(false);
            resetContactFormMutation();
          }, 5000);
        },
        onError: (error: Error) => {
          logger.error('Contact form submission error', { error });
          setLocalError(error.message || 'Failed to submit form. Please try again.');
        },
      });
    } catch (error) {
      logger.error('Contact form submission error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      setLocalError('An unexpected error occurred. Please try again.');
    }
  };

  const handleCloseError = () => {
    setLocalError(null);
    resetContactFormMutation();
  };

  return (
    <>
      {/* Error Message */}
      {localError && (
        <Alert 
          severity="error" 
          icon={<ErrorIcon />} 
          onClose={handleCloseError} 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            borderRadius: { xs: 1.5, sm: 2 },
          }}
        >
          {localError}
        </Alert>
      )}

      {/* Success Message */}
      {success && (
        <Snackbar
          open={success}
          autoHideDuration={5000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="success" 
            onClose={() => setSuccess(false)}
            sx={{ 
              width: '100%',
              borderRadius: { xs: 1.5, sm: 2 },
            }}
          >
            Thank you! Your message has been sent successfully.
          </Alert>
        </Snackbar>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'isMobile ? "auto" : "1fr"',
          gap: { xs: 3, md: 4 },
          alignItems: 'start',
        }}
      >
        {/* Form Section */}
        <Box sx={{ minWidth: 0 }}>
          <Paper 
            elevation={isMobile ? 1 : 2} 
            sx={{ 
              p: { xs: 2.5, sm: 3, md: 4 },
              borderRadius: 0,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: { md: 'translateY(-4px)' },
                boxShadow: { md: 4 },
              },
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: { xs: 2, sm: 2.5, md: 3 }, 
                fontWeight: 700,
                fontSize: { 
                  xs: '1.35rem',
                  sm: '1.5rem',
                  md: '1.75rem',
                  lg: '2rem'
                },
                color: 'text.primary',
              }}
            >
              Send us a Message
            </Typography>

            <Typography 
              variant="body2" 
              sx={{ 
                mb: { xs: 3, sm: 4 }, 
                color: 'text.secondary',
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
              }}
            >
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(handleFormSubmission)}
              noValidate
              sx={{ width: '100%' }}
            >
              {/* Name Field */}
              <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full Name"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      disabled={isFormSubmitting}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Email Field */}
              <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email Address"
                      type="email"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      disabled={isFormSubmitting}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Phone Number Field */}
              <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      disabled={isFormSubmitting}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Subject Field */}
              <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Subject"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      disabled={isFormSubmitting}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 1,
                        },
                      }}
                    >
                      {CONTACT_CONSTANTS.SUBJECT_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>

              {/* Message Field */}
              <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <Controller
                  name="message"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Message"
                      multiline
                      rows={isMobile ? 4 : 6}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      disabled={isFormSubmitting}
                      required
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="primary"
                size={isMobile ? "md" : "lg"}
                loading={isFormSubmitting}
                disabled={isFormSubmitting}
                leftIcon={!isFormSubmitting ? <Send /> : undefined}
                sx={{
                  py: { xs: 1.25, sm: 1.5, md: 1.75 },
                  fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                  borderRadius: 1,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(66, 166, 5, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(66, 166, 5, 0.4)',
                  },
                }}
              >
                {isFormSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Contact Information Section */}
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ 
            position: { md: 'sticky' },
            top: { md: 100 },
          }}>
            <Paper 
              elevation={isMobile ? 1 : 2}
              sx={{ 
                p: { xs: 2.5, sm: 3, md: 4 },
                borderRadius: 0,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: { xs: 2, sm: 3 }, 
                  fontWeight: 700,
                  fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' },
                }}
              >
                Contact Information
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 2,
                    lineHeight: 1.6,
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  }}
                >
                  Have a question or need assistance? Reach out to us through any of these channels.
                </Typography>
              </Box>

              {/* Contact Details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                  }}>
                    <Phone sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 24 } }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      +234 906 819 2247
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Mon-Fri, 9am-6pm
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                  }}>
                    <Email sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 24 } }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-all' }}>
                      customerservice@predictgalore.com
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                  }}>
                    <AccessTime sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 24 } }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Response Time
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Within 24 hours
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Weekdays & Weekends
                    </Typography>
                  </Box>
                </Box>
              </Box>


            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ContactForm;
