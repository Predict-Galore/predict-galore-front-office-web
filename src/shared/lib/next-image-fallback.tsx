/**
 * Global Next/Image fallback wrapper.
 * Imported via webpack alias to replace all `next/image` usages.
 */
'use client';

import React, { useMemo, useState, useCallback } from 'react';
import type { ImageProps } from 'next/image';
import RealNextImage from 'next/dist/shared/lib/image-external';
import { getFallbackImage } from '@/shared/constants/image-fallbacks';

type FallbackProps = {
  fallbackSrc?: string;
  fallbackVariant?: 'full' | 'thumb';
};

function ImageWithFallback({
  src,
  fallbackSrc,
  fallbackVariant = 'full',
  ...rest
}: ImageProps & FallbackProps) {
  const [failed, setFailed] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (failed || !src) {
      return fallbackSrc || getFallbackImage(fallbackVariant);
    }
    return src;
  }, [failed, fallbackSrc, fallbackVariant, src]);

  const handleError = useCallback(() => setFailed(true), []);

  return <RealNextImage src={resolvedSrc} onError={handleError} {...rest} />;
}

export default ImageWithFallback;
export * from 'next/image';
