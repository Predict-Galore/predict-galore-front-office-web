/**
 * AUTH PAGES LOADING COMPONENT
 * 
 * Skeleton loader that matches the auth layout structure
 * Displays while authentication pages are loading
 */

'use client';

import { Box, Skeleton } from '@mui/material';

export default function AuthPagesLoading() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'common.white' }}>
      {/* LEFT PANEL: Image Skeleton (55% width) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          flex: '0 0 55%',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
        }}
      >
        {/* Background Image Skeleton */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />

        {/* Logo Skeleton */}
        <Box
          sx={{
            position: 'absolute',
            top: 40,
            left: 40,
            bgcolor: 'common.white',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            boxShadow: '0px 10px 30px rgba(0,0,0,0.15)',
            zIndex: 10,
          }}
        >
          <Skeleton variant="rectangular" width={140} height={40} animation="wave" />
        </Box>

        {/* Text Overlay Skeleton */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            px: 6,
            pb: 8,
            pt: 12,
            zIndex: 10,
          }}
        >
          <Skeleton
            variant="text"
            width="80%"
            height={60}
            animation="wave"
            sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.3)' }}
          />
          <Skeleton
            variant="text"
            width="70%"
            height={60}
            animation="wave"
            sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.3)' }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={30}
            animation="wave"
            sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
          />
        </Box>
      </Box>

      {/* RIGHT PANEL: Form Skeleton */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, md: 8 },
          position: 'relative',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          {/* Title Skeleton */}
          <Skeleton
            variant="text"
            width="60%"
            height={50}
            animation="wave"
            sx={{ mb: 1 }}
          />
          
          {/* Subtitle Skeleton */}
          <Skeleton
            variant="text"
            width="80%"
            height={30}
            animation="wave"
            sx={{ mb: 4 }}
          />

          {/* Form Fields Skeleton */}
          <Box sx={{ mb: 3 }}>
            <Skeleton
              variant="text"
              width="30%"
              height={25}
              animation="wave"
              sx={{ mb: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              animation="wave"
              sx={{ borderRadius: 1, mb: 3 }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Skeleton
              variant="text"
              width="30%"
              height={25}
              animation="wave"
              sx={{ mb: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              animation="wave"
              sx={{ borderRadius: 1 }}
            />
          </Box>

          {/* Additional Options Skeleton */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Skeleton variant="text" width="40%" height={25} animation="wave" />
            <Skeleton variant="text" width="35%" height={25} animation="wave" />
          </Box>

          {/* Button Skeleton */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={56}
            animation="wave"
            sx={{ borderRadius: 1, mb: 3 }}
          />

          {/* Divider Skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={1} animation="wave" />
            <Skeleton variant="text" width={60} height={25} animation="wave" />
            <Skeleton variant="rectangular" width="100%" height={1} animation="wave" />
          </Box>

          {/* Social Buttons Skeleton */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={56}
            animation="wave"
            sx={{ borderRadius: 1, mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={56}
            animation="wave"
            sx={{ borderRadius: 1, mb: 3 }}
          />

          {/* Footer Link Skeleton */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Skeleton variant="text" width={150} height={25} animation="wave" />
          </Box>
        </Box>

        {/* Footer Copyright Skeleton */}
        <Box sx={{ position: 'absolute', bottom: 30 }}>
          <Skeleton variant="text" width={250} height={20} animation="wave" />
        </Box>
      </Box>
    </Box>
  );
}