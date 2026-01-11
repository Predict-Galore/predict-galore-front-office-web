/**
 * Contact Form Component
 * Feature component for contact form
 */

'use client';

import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Paper,
  Snackbar,
} from '@mui/material';
import { Send, Error as ErrorIcon } from '@mui/icons-material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema } from '../validations/schemas';
import type { ContactFormData } from '../model/types';
import { useSubmitContactForm } from '../api/hooks';
import { CONTACT_CONSTANTS } from '../lib/constants';
import { createLogger } from '@/shared/api/logger';

const logger = createLogger('ContactForm');

const ContactForm: React.FC = () => {
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
        <Alert severity="error" icon={<ErrorIcon />} onClose={handleCloseError} sx={{ mb: 3 }}>
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
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Thank you! Your message has been sent successfully.
          </Alert>
        </Snackbar>
      )}

      {/* Form */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Get in Touch
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmission)}
          noValidate
          sx={{ width: '100%' }}
        >
          {/* Name Field */}
          <Box sx={{ mb: 3 }}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Name"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isFormSubmitting}
                  required
                />
              )}
            />
          </Box>

          {/* Email Field */}
          <Box sx={{ mb: 3 }}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isFormSubmitting}
                  required
                />
              )}
            />
          </Box>

          {/* Phone Number Field */}
          <Box sx={{ mb: 3 }}>
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
                />
              )}
            />
          </Box>

          {/* Subject Field */}
          <Box sx={{ mb: 3 }}>
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
          <Box sx={{ mb: 3 }}>
            <Controller
              name="message"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Message"
                  multiline
                  rows={6}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isFormSubmitting}
                  required
                />
              )}
            />
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isFormSubmitting}
            startIcon={isFormSubmitting ? <CircularProgress size={20} /> : <Send />}
            sx={{
              py: 1.5,
              bgcolor: '#16a34a',
              '&:hover': {
                bgcolor: '#15803d',
              },
            }}
          >
            {isFormSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default ContactForm;
