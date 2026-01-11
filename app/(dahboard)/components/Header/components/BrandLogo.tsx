'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BrandLogo: React.FC = () => {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <Image
        src="/predict-galore-logo.png"
        alt="Predict Galore"
        width={140}
        height={36}
        priority
        className="h-9 w-auto"
      />
    </Link>
  );
};

export default BrandLogo;
