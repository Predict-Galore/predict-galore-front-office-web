'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { IMAGES } from '@/shared/constants/images';

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

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: 'white', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          color: 'text.primary'
        }}
      >
          <Toolbar sx={{ height: { xs: 64, md: 80 }, px: { xs: 2, sm: 3, md: 4 } }}>
            {/* Logo */}
            <Box sx={{ flexGrow: 0, mr: 2 }}>
              <Box
                onClick={() => handleNavigate('/')}
                sx={{ cursor: 'pointer', display: 'inline-flex' }}
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
                  width={150}
                  height={32}
                  priority
                  style={{ height: 32, width: 'auto' }}
                  unoptimized
                />
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                {/* Center Navigation */}
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                  <Stack direction="row" spacing={4}>
                    {navLinks.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <Button
                          key={link.href}
                          onClick={() => handleNavigate(link.href)}
                          sx={{
                            color: active ? 'success.main' : 'text.secondary',
                            fontWeight: active ? 600 : 500,
                            textTransform: 'none',
                            fontSize: '1rem',
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
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => handleNavigate('/login')}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 1,
                      px: 6,
                      py: 1.25,
                      borderColor: 'success.main',
                      color: 'success.main',
                      '&:hover': {
                        borderColor: 'success.dark',
                        backgroundColor: 'success.50',
                      },
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
                      px: 6,
                      py: 1.25,
                      bgcolor: 'success.main',
                      '&:hover': {
                        bgcolor: 'success.dark',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Stack>
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={handleMobileMenuToggle}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              </Box>
            )}
          </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={isMobile && mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            top: { xs: 64, md: 80 },
            bgcolor: 'white',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Navigation Links */}
          <List>
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <ListItem key={link.href} disablePadding>
                  <ListItemButton
                    onClick={() => handleMobileNavClick(link.href)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      bgcolor: active ? 'success.50' : 'transparent',
                      '&:hover': {
                        bgcolor: active ? 'success.100' : 'grey.50',
                      },
                    }}
                  >
                    <ListItemText
                      primary={link.label}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: active ? 'success.main' : 'text.primary',
                          fontWeight: active ? 600 : 500,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleMobileNavClick('/login')}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                py: 1.5,
                borderColor: 'success.main',
                color: 'success.main',
                '&:hover': {
                  borderColor: 'success.dark',
                  backgroundColor: 'success.50',
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
                borderRadius: 1,
                py: 1.5,
                bgcolor: 'success.main',
                '&:hover': {
                  bgcolor: 'success.dark',
                },
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* Spacer to prevent content overlap */}
      <Toolbar sx={{ height: { xs: 64, md: 80 } }} />
    </>
  );
};

export default Header;
