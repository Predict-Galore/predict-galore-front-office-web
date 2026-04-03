/**
 * Verify OTP Form Component
 * Matches UI screenshots and routes into reset-password flow.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Alert, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/Button/Button';
import { RedirectLoader } from '@/shared/components/ui';
import { AUTH_CONSTANTS } from '../lib/constants';
import { useForgotPasswordMutation, useVerifyPasswordResetOtpMutation } from '../api/hooks';

interface VerifyOTPFormProps {
  email?: string;
}

const VerifyOTPForm: React.FC<VerifyOTPFormProps> = ({ email }) => {
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const { mutate: resendCode, isPending: isResending } = useForgotPasswordMutation();
  const {
    mutate: verifyOtp,
    isPending: isVerifying,
  } = useVerifyPasswordResetOtpMutation();

  const isBusy = isResending || isVerifying;
  const otpValue = otp.join('');
  const isOtpComplete = otp.every((digit) => digit !== '');

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    const digits = pasted.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 0) return;

    const next = [...otp];
    digits.forEach((d, i) => {
      if (i < 6) next[i] = d;
    });
    setOtp(next);

    const nextEmptyIndex = next.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Missing email. Please go back and enter your email again.',
      });
      return;
    }
    if (otpValue.length !== 6) return;

    verifyOtp(
      { email, token: otpValue },
      {
        onSuccess: (resp) => {
          const tokenFromApi =
            (resp as unknown as { data?: { token?: string } })?.data?.token ?? otpValue;
          setSnackbar({ open: true, severity: 'success', message: 'Code verified.' });
          router.push(`${AUTH_CONSTANTS.ROUTES.RESET_PASSWORD}?token=${encodeURIComponent(tokenFromApi)}`);
        },
        onError: (err: Error) => {
          setSnackbar({
            open: true,
            severity: 'error',
            message: err.message || 'Unable to verify code. Please try again.',
          });
        },
      }
    );
  };

  const handleResendCode = () => {
    if (!email) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Missing email. Please go back and enter your email again.',
      });
      return;
    }

    resendCode(
      { email },
      {
        onSuccess: () => {
          setSnackbar({ open: true, severity: 'success', message: 'Code resent.' });
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        },
        onError: (err: Error) => {
          setSnackbar({
            open: true,
            severity: 'error',
            message: err.message || 'Unable to resend code. Please try again.',
          });
        },
      }
    );
  };

  return (
    <Box>
      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <Typography
          sx={{
            fontSize: { xs: '3rem', sm: '3.5rem', md: '4rem' },
            fontWeight: 900,
            color: '#101828',
            fontFamily: '"Arial Black", sans-serif',
            lineHeight: 1,
            mb: 1,
          }}
        >
          Verify your Identity
        </Typography>
        <Typography sx={{ color: '#667085', fontSize: { xs: '1.25rem', md: '1.35rem' } }}>
          Input the 6 digit one time password (otp) sent to{' '}
          <Box component="span" sx={{ color: '#101828', fontWeight: 600 }}>
            {email || 'your email'}
          </Box>
        </Typography>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box component="form" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1.5, sm: 2 },
            mb: 4,
            justifyContent: 'space-between',
          }}
        >
          {otp.map((digit, index) => (
            <Box
              key={index}
              component="input"
              ref={(el: HTMLInputElement | null) => {
                inputRefs.current[index] = el;
              }}
              value={digit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isBusy}
              inputMode="numeric"
              maxLength={1}
              sx={{
                width: { xs: 52, sm: 64 },
                height: { xs: 64, sm: 72 },
                borderRadius: 2,
                border: '1px solid #D0D5DD',
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                textAlign: 'center',
                outline: 'none',
                color: '#101828',
                '&:focus': {
                  borderColor: '#4AA900',
                  boxShadow: '0 0 0 4px rgba(74,169,0,0.12)',
                },
              }}
            />
          ))}
        </Box>

        <Button
          type="submit"
          fullWidth
          disabled={!isOtpComplete || isBusy}
          sx={{
            bgcolor: '#4AA900',
            height: { xs: 72, md: 64 },
            fontSize: { xs: '1.25rem', md: '1.1rem' },
            fontWeight: 700,
            borderRadius: '14px',
            '&:hover': { bgcolor: '#3d8a00' },
            '&:disabled': { bgcolor: '#C8E6B8', color: '#7FB36D' },
          }}
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#667085', display: 'inline' }}>
            Didn&apos;t receive a code?{' '}
          </Typography>
          <Box
            component="span"
            onClick={handleResendCode}
            sx={{
              color: '#4AA900',
              fontWeight: 700,
              cursor: isBusy ? 'not-allowed' : 'pointer',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Resend Code
          </Box>
        </Box>
      </Box>

      <RedirectLoader show={isBusy} message="Verifying code..." />
    </Box>
  );
};

export default VerifyOTPForm;
