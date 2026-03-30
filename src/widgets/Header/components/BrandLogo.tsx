'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMediaQuery, useTheme } from '@mui/material';

const BrandLogo: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const logoWidth = isMobile ? 100 : isTablet ? 120 : 140;
  const logoHeight = isMobile ? 26 : isTablet ? 32 : 36;

  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <Image
        src="/predict-galore-logo.png"
        alt="Predict Galore"
        width={logoWidth}
        height={logoHeight}
        priority
      />
    </Link>
  );
};

export default BrandLogo;
