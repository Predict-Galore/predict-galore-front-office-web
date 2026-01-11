/**
 * Premium Subscription Modal Component
 * Matches Figma design for premium subscription modal
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, IconButton, Button, Box, Typography } from '@mui/material';
import { Close, Bolt, CheckCircle } from '@mui/icons-material';
import Image from 'next/image';
import { useSubscriptionPlans } from '@/features/profile';
import { cn } from '@/shared/lib/utils';
import { text } from '@/shared/constants/styles';

interface Plan {
  id: number;
  name: string;
  planCode: string;
  amount: number;
  duration: number;
  isActive: boolean;
}

interface PremiumSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (planId: number) => void;
}

const PremiumSubscriptionModal: React.FC<PremiumSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
}) => {
  const { data: plans = [], isLoading: isPlansLoading } = useSubscriptionPlans();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Features list
  const features = [
    'Over 15 bet predictions across 8 different sports',
    'Player-specific predictions',
    'News updates specific to players',
    'Early access to new features',
  ];

  // Separate plans into Yearly and Monthly
  const { yearlyPlan, monthlyPlan } = useMemo(() => {
    const yearly = plans.find(
      (plan) => plan.planCode.toLowerCase().includes('yearly') || plan.duration >= 365
    );
    const monthly = plans.find(
      (plan) => plan.planCode.toLowerCase().includes('monthly') || plan.duration <= 31
    );
    return { yearlyPlan: yearly || null, monthlyPlan: monthly || null };
  }, [plans]);

  // Set default selected plan to yearly
  useEffect(() => {
    if (!selectedPlan && yearlyPlan) {
      setSelectedPlan(yearlyPlan);
    }
  }, [yearlyPlan, selectedPlan]);

  const handlePlanSelect = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedPlan && onSubscribe) {
      onSubscribe(selectedPlan.id);
    }
    // TODO: Implement actual subscription payment logic
    console.log('Continue to pay for plan:', selectedPlan);
  }, [selectedPlan, onSubscribe]);

  const isYearlySelected = selectedPlan?.id === yearlyPlan?.id;
  const isMonthlySelected = selectedPlan?.id === monthlyPlan?.id;

  // Calculate savings for yearly plan (assuming monthly is $20/month)
  const yearlySavings = monthlyPlan ? monthlyPlan.amount * 12 - (yearlyPlan?.amount || 0) : 0;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#166534', // dark green
          borderRadius: '16px',
          maxWidth: '500px',
        },
      }}
    >
      <DialogContent className="p-6 text-white">
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-green-700"
          size="small"
        >
          <Close />
        </IconButton>

        {/* Logo and Tagline */}
        <Box className="flex flex-col items-center mb-6">
          <Box className="flex items-center justify-center mb-4">
            <Image
              src="/predict-galore-logo.png"
              alt="Predict Galore"
              width={160}
              height={48}
              priority
              className="h-12 w-auto"
            />
          </Box>
          <Typography
            className={cn(text.body.medium, 'text-center text-white/90 mb-6')}
            sx={{ fontSize: '14px' }}
          >
            Your winning streak starts with premium insights, go pro now!
          </Typography>
        </Box>

        {/* Trial Period Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<Bolt />}
          className={cn(
            'mb-6 normal-case bg-green-500 hover:bg-green-400 text-white font-semibold',
            'rounded-lg py-3'
          )}
          sx={{
            backgroundColor: '#22c55e',
            '&:hover': {
              backgroundColor: '#16a34a',
            },
          }}
        >
          14 days trial period
        </Button>

        {/* Features List */}
        <Box className="mb-6 space-y-3">
          {features.map((feature, index) => (
            <Box key={index} className="flex items-start gap-3">
              <CheckCircle
                className="text-red-500 flex-shrink-0 mt-0.5"
                sx={{ fontSize: '20px' }}
              />
              <Typography className={cn(text.body.medium, 'text-white')} sx={{ fontSize: '14px' }}>
                {feature}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Subscription Plans */}
        <Box className="grid grid-cols-2 gap-4 mb-6">
          {/* Yearly Plan */}
          {yearlyPlan && (
            <Box
              onClick={() => handlePlanSelect(yearlyPlan)}
              className={cn(
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                isYearlySelected
                  ? 'border-red-500 bg-green-800/50'
                  : 'border-white/30 bg-green-800/20 hover:border-white/50'
              )}
            >
              <Box className="flex items-center justify-between mb-2">
                <Typography
                  className={cn(
                    text.heading.h6,
                    isYearlySelected ? 'text-red-500' : 'text-white',
                    'font-semibold'
                  )}
                  sx={{ fontSize: '14px' }}
                >
                  Yearly
                </Typography>
                {isYearlySelected && (
                  <CheckCircle className="text-red-500" sx={{ fontSize: '20px' }} />
                )}
              </Box>
              <Typography
                className={cn(text.heading.h4, 'text-white font-bold mb-2')}
                sx={{ fontSize: '24px' }}
              >
                ${yearlyPlan.amount.toFixed(2)}
              </Typography>
              {yearlySavings > 0 && (
                <Button
                  variant="contained"
                  size="small"
                  className={cn(
                    'mb-2 normal-case bg-red-500 hover:bg-red-600 text-white',
                    'text-xs px-2 py-1'
                  )}
                  sx={{ fontSize: '10px', minWidth: 'auto' }}
                >
                  Save ${yearlySavings.toFixed(2)}
                </Button>
              )}
              <Typography
                className={cn(text.body.small, isYearlySelected ? 'text-red-500' : 'text-white/70')}
                sx={{ fontSize: '12px', textAlign: 'right' }}
              >
                Billed yearly
              </Typography>
            </Box>
          )}

          {/* Monthly Plan */}
          {monthlyPlan && (
            <Box
              onClick={() => handlePlanSelect(monthlyPlan)}
              className={cn(
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                isMonthlySelected
                  ? 'border-red-500 bg-green-800/50'
                  : 'border-white/30 bg-green-800/20 hover:border-white/50'
              )}
            >
              <Box className="flex items-center justify-between mb-2">
                <Typography
                  className={cn(
                    text.heading.h6,
                    isMonthlySelected ? 'text-red-500' : 'text-white',
                    'font-semibold'
                  )}
                  sx={{ fontSize: '14px' }}
                >
                  Monthly
                </Typography>
                {isMonthlySelected && (
                  <CheckCircle className="text-red-500" sx={{ fontSize: '20px' }} />
                )}
              </Box>
              <Typography
                className={cn(text.heading.h4, 'text-white font-bold mb-2')}
                sx={{ fontSize: '24px' }}
              >
                ${monthlyPlan.amount.toFixed(2)}
              </Typography>
              <Typography
                className={cn(
                  text.body.small,
                  isMonthlySelected ? 'text-red-500' : 'text-white/70'
                )}
                sx={{ fontSize: '12px', textAlign: 'right' }}
              >
                Billed Monthly
              </Typography>
            </Box>
          )}
        </Box>

        {/* Continue Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleContinue}
          disabled={!selectedPlan || isPlansLoading}
          className={cn(
            'normal-case bg-green-500 hover:bg-green-400 text-white font-semibold',
            'rounded-lg py-3'
          )}
          sx={{
            backgroundColor: '#22c55e',
            '&:hover': {
              backgroundColor: '#16a34a',
            },
          }}
        >
          {selectedPlan ? `Continue to pay $${selectedPlan.amount.toFixed(2)}` : 'Select a plan'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumSubscriptionModal;
