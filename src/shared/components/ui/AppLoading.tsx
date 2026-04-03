// shared/components/ui/AppLoading.tsx
'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';

export default function AppLoading() {
  const shapes = useMemo(
    () =>
      [...Array(8)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      })),
    []
  );

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.background.default} 50%, ${theme.palette.success.main} 100%)`,
        textAlign: 'center',
        gap: 4,
        overflow: 'hidden',
      })}
    >
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <motion.div
          className="relative"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Image
            src="/predict-galore-logo.png"
            alt="Predict Galore"
            width={280}
            height={80}
            className="drop-shadow-2xl"
            priority
          />
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '1rem',
            border: '4px solid',
            borderColor: 'rgba(54, 177, 94, 0.3)',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              left: '50%',
              top: '50%',
              marginLeft: -4,
              marginTop: -4,
            }}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i * 60 * Math.PI) / 180) * 100,
              y: Math.sin((i * 60 * Math.PI) / 180) * 100,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      <Box
        component={motion.div}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={(theme) => ({
            color: theme.palette.success.dark,
            fontWeight: 700,
            letterSpacing: '-0.025em',
          })}
        >
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {'Predicting Excellence'.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.8 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        </Typography>

        <Box
          component={motion.div}
          sx={(theme) => ({
            width: 256,
            height: 8,
            backgroundColor: theme.palette.success.light,
            borderRadius: '999px',
            overflow: 'hidden',
          })}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Box
            component={motion.div}
            sx={(theme) => ({
              height: '100%',
              background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
              borderRadius: '999px',
            })}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatType: 'reverse',
            }}
          />
        </Box>

        <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <Typography
            variant="body2"
            sx={(theme) => ({
              color: theme.palette.success.dark,
              opacity: 0.8,
              fontWeight: 500,
              letterSpacing: '0.05em',
            })}
          >
            Preparing your experience...
          </Typography>
        </Box>
      </Box>

      <Box
        component={motion.div}
        sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {shapes.map((position, i) => (
          <Box
            key={i}
            component={motion.div}
            sx={(theme) => ({
              position: 'absolute',
              width: 24,
              height: 24,
              border: '2px solid',
              borderColor: theme.palette.success.light,
              borderRadius: '50%',
              ...position,
            })}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
          />
        ))}
      </Box>
    </Box>
  );
}

