/**
 * SafeImage
 * Wraps next/image with automatic fallback when the primary src fails.
 */
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';
import { getFallbackImage } from '@/shared/constants/image-fallbacks';

type SafeImageProps = ImageProps & {
  fallbackSrc?: string;
  fallbackVariant?: 'full' | 'thumb';
};

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc,
  fallbackVariant = 'full',
  alt = '',
  ...rest
}) => {
  const [failed, setFailed] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (failed) return fallbackSrc || getFallbackImage(fallbackVariant);
    return src;
  }, [failed, fallbackSrc, fallbackVariant, src]);

  const handleError = useCallback(() => setFailed(true), []);

  return <Image src={resolvedSrc} alt={alt} onError={handleError} {...rest} />;
};

export default SafeImage;
