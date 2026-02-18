/**
 * Social auth buttons shared across auth forms.
 * Matches Figma (centered square icon buttons + divider).
 */
 
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Button } from '@/shared/components/ui/Button/Button';
import { AUTH_CONSTANTS } from '../lib/constants';

export interface SocialAuthButtonsProps {
  disabled?: boolean;
  label?: string;
  onProviderClick?: (providerName: string) => void;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  disabled = false,
  label = 'Or continue with',
  onProviderClick,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Divider */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'neutral.200' }} />
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {label}
        </Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'neutral.200' }} />
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {AUTH_CONSTANTS.SOCIAL_PROVIDERS.map((provider) => (
          <Button
            key={provider.name}
            variant="social"
            size="lg"
            disabled={disabled}
            aria-label={provider.name}
            onClick={() => onProviderClick?.(provider.name)}
          >
            <provider.icon size={26} />
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default SocialAuthButtons;

