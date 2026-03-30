'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Typography,
  Container,
  Slide,
  Fade,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { IMAGES } from '@/shared/constants/images';

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navLinks = [
    { href: '/landing-page', label: 'Home' },
    { href: '/terms', label: 'Terms' },
    { href: '/contact-us', label: 'Contact' },
  ];

  // Determine if a link is active (default to home if on root or landing-page)
  const isActive = (href: string) => {
    if (href === '/landing-page') {
      return pathname === '/' || pathname === '/landing-page';
    }
    return pathname === href;
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigate = (href: string) => {
    if (href === pathname) {
      setMobileMenuOpen(false);
      return;
    }

    router.push(href);
    setMobileMenuOpen(false);
  };

  const handleMobileNavClick = (href: string) => {
    handleNavigate(href);
  };

  // Logo dimensions based on screen size
  const logoWidth = isMobile ? 120 : isTablet ? 135 : 150;
  const logoHeight = isMobile ? 26 : isTablet ? 29 : 32;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled ? 2 : 0}
        sx={{
          bgcolor: scrolled ? alpha('#fff', 0.95) : 'white',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
          color: 'text.primary',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Toolbar
            sx={{
              height: { xs: 64, sm: 72, md: 80 },
              px: { xs: 2, sm: 3, md: 4 },
              transition: 'height 0.3s ease',
            }}
          >
            {/* Logo */}
            <Box sx={{ flexGrow: 0, mr: { xs: 1, sm: 2, md: 3 } }}>
              <Box
                onClick={() => handleNavigate('/')}
                sx={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.8 },
                }}
                role="button"
                aria-label="Go to home page"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleNavigate('/');
                  }
                }}
              >
                <Image
                  src={IMAGES.LOGO.MAIN}
                  alt="Predict Galore"
                  width={logoWidth}
                  height={logoHeight}
                  priority
                  unoptimized
                />
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {isDesktop && (
              <>
                {/* Center Navigation */}
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                  <Stack
                    direction="row"
                    spacing={{ md: 3, lg: 4, xl: 5 }}
                    sx={{
                      '& .MuiButton-root': {
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 2,
                          bgcolor: 'success.main',
                          transition: 'width 0.3s ease',
                          borderRadius: 1,
                        },
                        '&:hover::after': {
                          width: '80%',
                        },
                        '&.active::after': {
                          width: '80%',
                        },
                      },
                    }}
                  >
                    {navLinks.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <Button
                          key={link.href}
                          onClick={() => handleNavigate(link.href)}
                          className={active ? 'active' : ''}
                          sx={{
                            color: active ? 'success.main' : 'text.secondary',
                            fontWeight: active ? 600 : 500,
                            textTransform: 'none',
                            fontSize: { md: '0.95rem', lg: '1rem' },
                            '&:hover': {
                              color: 'success.main',
                              backgroundColor: 'transparent',
                            },
                          }}
                        >
                          {link.label}
                        </Button>
                      );
                    })}
                  </Stack>
                </Box>

                {/* Right Action Buttons */}
                <Stack direction="row" spacing={{ md: 1.5, lg: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleNavigate('/login')}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 1,
                      px: { md: 4, lg: 5, xl: 6 },
                      py: { md: 1, lg: 1.25 },
                      fontSize: { md: '0.9rem', lg: '0.95rem' },
                      borderColor: 'success.main',
                      color: 'success.main',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'success.dark',
                        backgroundColor: alpha(theme.palette.success.main, 0.04),
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    Sign In
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => handleNavigate('/register')}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 1,
                      px: { md: 4, lg: 5, xl: 6 },
                      py: { md: 1, lg: 1.25 },
                      fontSize: { md: '0.9rem', lg: '0.95rem' },
                      bgcolor: 'success.main',
                      boxShadow: '0 4px 12px rgba(66, 166, 5, 0.3)',
                      '&:hover': {
                        bgcolor: 'success.dark',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 16px rgba(66, 166, 5, 0.4)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    Sign Up
                  </Button>
                </Stack>
              </>
            )}

            {/* Tablet/Mobile Menu Button */}
            {!isDesktop && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={handleMobileMenuToggle}
                  sx={{
                    color: 'text.secondary',
                    width: { xs: 40, sm: 44 },
                    height: { xs: 40, sm: 44 },
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: alpha(theme.palette.success.main, 0.04),
                    },
                  }}
                >
                  {mobileMenuOpen ? (
                    <CloseIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                  ) : (
                    <MenuIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                  )}
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile/Tablet Drawer */}
      <Drawer
        anchor="top"
        open={!isDesktop && mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            top: { xs: 64, sm: 72 },
            bgcolor: 'white',
            maxHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
            transition: 'top 0.3s ease',
          },
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            maxWidth: '600px',
            mx: 'auto',
            width: '100%',
          }}
        >
          {/* Navigation Links */}
          <List sx={{ mb: 2 }}>
            {navLinks.map((link, index) => {
              const active = isActive(link.href);
              return (
                <Slide
                  direction="right"
                  in={mobileMenuOpen}
                  timeout={300 + index * 50}
                  key={link.href}
                >
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleMobileNavClick(link.href)}
                      sx={{
                        borderRadius: { xs: 1.5, sm: 2 },
                        py: { xs: 1.25, sm: 1.5 },
                        px: { xs: 2, sm: 2.5 },
                        bgcolor: active ? alpha(theme.palette.success.main, 0.08) : 'transparent',
                        '&:hover': {
                          bgcolor: active
                            ? alpha(theme.palette.success.main, 0.12)
                            : alpha(theme.palette.grey[500], 0.05),
                        },
                      }}
                    >
                      <ListItemText
                        primary={link.label}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: active ? 'success.main' : 'text.primary',
                            fontWeight: active ? 600 : 500,
                            fontSize: { xs: '0.95rem', sm: '1rem' },
                          },
                        }}
                      />
                      {active && (
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            ml: 1,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </Slide>
              );
            })}
          </List>

          <Divider sx={{ my: { xs: 2, sm: 3 } }} />

          {/* Action Buttons */}
          <Fade in={mobileMenuOpen} timeout={500}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 2 }}
              sx={{ mt: 2 }}
            >
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleMobileNavClick('/login')}
                sx={{
                  textTransform: 'none',
                  borderRadius: { xs: 1.5, sm: 2 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  borderColor: 'success.main',
                  color: 'success.main',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'success.dark',
                    backgroundColor: alpha(theme.palette.success.main, 0.04),
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleMobileNavClick('/register')}
                sx={{
                  textTransform: 'none',
                  borderRadius: { xs: 1.5, sm: 2 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  bgcolor: 'success.main',
                  boxShadow: '0 4px 12px rgba(66, 166, 5, 0.3)',
                  '&:hover': {
                    bgcolor: 'success.dark',
                  },
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </Fade>

          {/* Additional mobile info (optional) */}
          {isMobile && (
            <Fade in={mobileMenuOpen} timeout={700}>
              <Box
                sx={{
                  mt: 4,
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}
                >
                  Get the app
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button size="small" sx={{ textTransform: 'none' }}>
                    App Store
                  </Button>
                  <Button size="small" sx={{ textTransform: 'none' }}>
                    Google Play
                  </Button>
                </Stack>
              </Box>
            </Fade>
          )}
        </Box>
      </Drawer>

      {/* Spacer to prevent content overlap - matches header height */}
      <Toolbar sx={{ height: { xs: 64, sm: 72, md: 80 } }} />
    </>
  );
};

export default Header;
