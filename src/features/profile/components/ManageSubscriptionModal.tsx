/**
 * Manage Subscription Modal Component
 * Allows users to view and switch between subscription plans
 *
 * @component
 * @description Modal dialog for managing subscription plans.
 * Displays available plans and allows users to subscribe or switch plans.
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { Close, CheckCircle } from '@mui/icons-material';
import type { Subscription } from '@/features/profile/model/types';

/**
 * Subscription plan interface
 */
interface Plan {
  /** Unique plan identifier */
  id: number;
  /** Display name of the plan */
  name: string;
  /** Plan code for backend identification */
  planCode: string;
  /** Plan price amount */
  amount: number;
  /** Plan duration in days */
  duration: number;
  /** Whether the plan is currently active */
  isActive: boolean;
}

/**
 * Props for the ManageSubscriptionModal component
 */
interface ManageSubscriptionModalProps {
  /** Controls modal visibility */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Current active subscription */
  currentSubscription?: Subscription | null;
  /** Available subscription plans */
  plans: Plan[];
  /** Callback when subscription is changed */
  onSubscriptionChange: () => void;
}

/**
 * ManageSubscriptionModal Component
 *
 * Displays available subscription plans and allows users to subscribe or switch.
 * Shows current active plan with a checkmark indicator.
 *
 * @example
 * ```tsx
 * <ManageSubscriptionModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   currentSubscription={subscription}
 *   plans={availablePlans}
 *   onSubscriptionChange={handleSubscriptionChange}
 * />
 * ```
 */
const ManageSubscriptionModal: React.FC<ManageSubscriptionModalProps> = ({
  open,
  onClose,
  currentSubscription,
  plans = [],
  onSubscriptionChange,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Normalize plans data structure
  const planList: Plan[] = Array.isArray(plans)
    ? plans
    : plans && typeof plans === 'object'
      ? Object.values(plans as Record<string, Plan>)
      : [];

  /**
   * Handles plan selection
   */
  const handlePlanSelect = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
  }, []);

  /**
   * Handles subscription to selected plan
   */
  const handleSubscribe = useCallback(() => {
    if (selectedPlan) {
      // TODO: Implement subscription logic
      console.log('Subscribing to plan:', selectedPlan);
      onSubscriptionChange();
    }
  }, [selectedPlan, onSubscriptionChange]);

  /**
   * Checks if a plan is currently active
   */
  const isPlanActive = (plan: Plan) => {
    return (
      currentSubscription?.planCode === plan.planCode && currentSubscription?.status === 'active'
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          pb: 1.5,
        }}
      >
        <Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Manage your Subscription
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.600' }}>
            Switch between our subscription plans
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'grey.500', '&:hover': { color: 'grey.700' } }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Stack spacing={2}>
          {(planList || []).filter(Boolean).map((plan) => {
            const isActive = isPlanActive(plan);
            const planCode = String(plan.planCode ?? '').toLowerCase();
            const duration = plan.duration ?? 0;
            const amount = plan.amount;
            const formattedAmount =
              typeof amount === 'number' && Number.isFinite(amount) ? amount.toFixed(2) : '0.00';

            const isYearly = planCode.includes('yearly') || duration >= 365;
            const isMonthly = planCode.includes('monthly') || duration <= 31;

            return (
              <Box
                key={plan.id}
                onClick={() => handlePlanSelect(plan)}
                sx={{
                  p: 2,
                  border: '2px solid',
                  borderColor:
                    isActive || selectedPlan?.id === plan.id ? 'success.main' : 'grey.300',
                  bgcolor: isActive || selectedPlan?.id === plan.id ? 'success.50' : 'white',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: isActive ? 'success.main' : 'grey.400',
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="flex-start"
                  justifyContent="space-between"
                >
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {isYearly ? 'Yearly' : isMonthly ? 'Monthly' : plan.name}
                      </Typography>
                      {isActive && <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} />}
                    </Stack>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                      ${formattedAmount}
                    </Typography>
                  </Box>
                  <Button
                    variant={isActive ? 'contained' : 'outlined'}
                    disabled={isActive}
                    sx={{
                      textTransform: 'none',
                      ...(isActive
                        ? {
                            bgcolor: 'success.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'success.main' },
                          }
                        : {
                            borderColor: 'grey.400',
                            color: 'grey.800',
                            '&:hover': { bgcolor: 'grey.50' },
                          }),
                    }}
                  >
                    {isActive ? 'Subscribed' : 'Subscribe'}
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: 'grey.600' }}>
          Cancel
        </Button>
        {selectedPlan && !isPlanActive(selectedPlan) && (
          <Button
            onClick={handleSubscribe}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: 'success.main',
              color: 'white',
              '&:hover': { bgcolor: 'success.dark' },
            }}
          >
            Subscribe
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ManageSubscriptionModal;
