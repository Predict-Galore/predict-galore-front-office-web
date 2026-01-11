/**
 * Manage Subscription Modal Component
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
} from '@mui/material';
import { Close, CheckCircle } from '@mui/icons-material';
import { cn } from '@/shared/lib/utils';
import { text } from '@/shared/constants/styles';
import type { Subscription } from '@/features/profile/model/types';

interface Plan {
  id: number;
  name: string;
  planCode: string;
  amount: number;
  duration: number;
  isActive: boolean;
}

interface ManageSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  currentSubscription?: Subscription | null;
  plans: Plan[];
  onSubscriptionChange: () => void;
}

const ManageSubscriptionModal: React.FC<ManageSubscriptionModalProps> = ({
  open,
  onClose,
  currentSubscription,
  plans = [],
  onSubscriptionChange,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const planList: Plan[] = Array.isArray(plans)
    ? plans
    : plans && typeof plans === 'object'
      ? Object.values(plans as Record<string, Plan>)
      : [];

  const handlePlanSelect = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
  }, []);

  const handleSubscribe = useCallback(() => {
    if (selectedPlan) {
      // TODO: Implement subscription logic
      console.log('Subscribing to plan:', selectedPlan);
      onSubscriptionChange();
    }
  }, [selectedPlan, onSubscriptionChange]);

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
        className: 'rounded-lg',
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 1.5 }}>
        <Box>
          <h3 className={cn(text.heading.h5, 'font-bold mb-1')}>Manage your Subscription</h3>
          <p className={cn(text.body.small, 'text-gray-600')}>
            Switch between our subscription plans
          </p>
        </Box>
        <IconButton onClick={onClose} size="small" className="text-gray-500 hover:text-gray-700">
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
                className={cn(
                  'p-4 border-2 rounded-xl cursor-pointer transition-all',
                  isActive
                    ? 'border-[#22c55e] bg-[#ecfdf3]'
                    : 'border-gray-300 bg-white hover:border-gray-300',
                  selectedPlan?.id === plan.id && !isActive && 'border-[#22c55e] bg-[#ecfdf3]'
                )}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <h4 className={cn(text.heading.h6, 'font-semibold')}>
                        {isYearly ? 'Yearly' : isMonthly ? 'Monthly' : plan.name}
                      </h4>
                      {isActive && <CheckCircle className="text-green-600" fontSize="small" />}
                    </Box>
                    <p className={cn(text.heading.h5, 'font-bold text-gray-900')}>
                      ${formattedAmount}
                    </p>
                  </Box>
                  <Button
                    variant={isActive ? 'contained' : 'outlined'}
                    disabled={isActive}
                    className={cn(
                      'normal-case',
                      isActive
                        ? 'bg-[#19910c] text-white hover:bg-[#19910c]'
                        : 'border-gray-400 text-gray-800 hover:bg-gray-50'
                    )}
                    fullWidth
                  >
                    {isActive ? 'Subscribed' : 'Subscribe'}
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions className="px-6 pb-6">
        <Button onClick={onClose} className="normal-case text-gray-600">
          Cancel
        </Button>
        {selectedPlan && !isPlanActive(selectedPlan) && (
          <Button
            onClick={handleSubscribe}
            variant="contained"
            className="normal-case bg-[#19910c] text-white hover:bg-[#15830a]"
          >
            Subscribe
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ManageSubscriptionModal;
