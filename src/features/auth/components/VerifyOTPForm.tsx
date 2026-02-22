/**
 * Verify OTP Form Component
 * For password reset verification
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AUTH_CONSTANTS } from '../lib/constants';

interface VerifyOTPFormProps {
  email?: string;
  onSuccess?: (otp: string) => void;
}

const VerifyOTPForm: React.FC<VerifyOTPFormProps> = ({ email, onSuccess }) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /**
   * Handle OTP input change
   */
  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle backspace key
   */
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Handle paste event
   */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    if (digits.length > 0) {
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);

      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(otpValue);
      } else {
        // Default behavior: redirect to reset password with token
        router.push(`${AUTH_CONSTANTS.ROUTES.RESET_PASSWORD}?token=${otpValue}`);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle resend code
   */
  const handleResendCode = () => {
    // Reset OTP inputs
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    // TODO: Implement resend code API call
    console.log('Resend code to:', email);
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <Box>
      {/* Header */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', sm: '2.5rem' },
          fontWeight: 700,
          color: '#1a1a1a',
          mb: 2,
        }}
      >
        Verify your Identity
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#667085',
          fontSize: '1rem',
          mb: 4,
        }}
      >
        Input the 6 digit one time password (otp) sent to{' '}
        <Box component="span" sx={{ color: '#1a1a1a', fontWeight: 500 }}>
          {email || 'your email'}
        </Box>
      </Typography>

      {/* OTP Form */}
      <Box component="form" onSubmit={handleSubmit}>
        {/* OTP Input Fields */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            mb: 3,
            justifyContent: 'center',
          }}
        >
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isSubmitting}
              inputProps={{
                maxLength: 1,
                style: { textAlign: 'center' },
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
              sx={{
                width: { xs: '48px', sm: '64px' },
                '& .MuiOutlinedInput-root': {
                  height: { xs: '56px', sm: '64px' },
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  fontWeight: 600,
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#42A605',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#42A605',
                    borderWidth: '2px',
                  },
                  '& input': {
                    padding: 0,
                    textAlign: 'center',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: 0,
                },
              }}
            />
          ))}
        </Box>

        {/* Verify Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!isOtpComplete || isSubmitting}
          sx={{
            height: '56px',
            backgroundColor: '#42A605',
            color: 'white',
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 600,
            mb: 2,
            '&:hover': {
              backgroundColor: '#368005',
            },
            '&.Mui-disabled': {
              backgroundColor: '#9ca3af',
              color: '#ffffff',
            },
          }}
        >
          {isSubmitting ? 'Verifying...' : 'Verify'}
        </Button>

        {/* Resend Code Link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: '#667085',
              display: 'inline',
            }}
          >
            Didn&apos;t receive a code?{' '}
          </Typography>
          <Button
            variant="text"
            onClick={handleResendCode}
            disabled={isSubmitting}
            sx={{
              color: '#42A605',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 600,
              padding: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            Resend Code
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyOTPForm;
