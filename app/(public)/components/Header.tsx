'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon, Close } from '@mui/icons-material';
import Image from 'next/image';

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/landing-page', label: 'Home' },
    { href: '/contact-us', label: 'Contact' },
    { href: '/terms', label: 'Terms' },
  ];

  // Determine if a link is active (default to home if on root or landing-page)
  const isActive = (href: string) => {
    if (href === '/landing-page') {
      return pathname === '/' || pathname === '/landing-page';
    }
    return pathname === href;
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          backgroundColor: theme.palette.background.default,
          boxShadow: theme.shadows[1],
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar disableGutters>
          <Container
            maxWidth="xl"
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0,
              px: { xs: 2, sm: 3, lg: 4 },
            }}
          >
            {/* Logo - Left */}
            <Link href="/landing-page">
              <Image
                src="/predict-galore-logo.png"
                alt="Predict Galore"
                width={150}
                height={150}
                priority
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop: Nav Links - Center, Action Buttons - Right */}
            {!isMobile && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        style={{
                          color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                          textDecoration: 'none',
                          fontWeight: active ? 600 : theme.typography.fontWeightMedium,
                          fontSize: theme.typography.body1.fontSize,
                          transition: 'color 0.2s ease-in-out',
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.color = theme.palette.primary.main;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.color = theme.palette.text.secondary;
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button variant="outlined" color="primary" onClick={() => router.push('/login')}>
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/register')}
                  >
                    Sign Up
                  </Button>
                </Box>
              </>
            )}

            {/* Mobile: Menu Button */}
            {isMobile && (
              <>
                <IconButton
                  edge="end"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  sx={{ color: theme.palette.text.primary }}
                >
                  {mobileMenuOpen ? <Close /> : <MenuIcon />}
                </IconButton>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: theme.palette.background.default,
                      boxShadow: theme.shadows[4],
                      zIndex: 1000,
                      py: 2,
                    }}
                  >
                    <Container maxWidth="xl" sx={{ py: 0, px: { xs: 2, sm: 3, lg: 4 } }}>
                      {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                              display: 'block',
                              padding: theme.spacing(1.5, 0),
                              color: active
                                ? theme.palette.primary.main
                                : theme.palette.text.secondary,
                              textDecoration: 'none',
                              fontWeight: active ? 600 : theme.typography.fontWeightMedium,
                              backgroundColor: active
                                ? theme.palette.primary.main + '10'
                                : 'transparent',
                            }}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                      <Box
                        sx={{
                          pt: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          borderTop: `1px solid ${theme.palette.neutral[200]}`,
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          onClick={() => router.push('/login')}
                        >
                          Sign In
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => router.push('/register')}
                        >
                          Sign Up
                        </Button>
                      </Box>
                    </Container>
                  </Box>
                )}
              </>
            )}
          </Container>
        </Toolbar>
      </AppBar>
      {/* Offset to prevent content jump when header is fixed */}
      <Box sx={{ height: { xs: 72, md: 80 } }} />
    </>
  );
};

export default Header;
