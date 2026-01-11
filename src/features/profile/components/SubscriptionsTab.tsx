/**
 * Subscriptions Tab Component
 * Updated to match Figma UI design
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, Button, Chip, IconButton, Paper, Stack, Typography, Divider } from '@mui/material';
import { Close, ArrowForward } from '@mui/icons-material';
import {
  useCurrentSubscription,
  useSubscriptionPlans,
  useCancelSubscription,
  useTransactionHistory,
} from '@/features/profile';
import { LoadingState } from '@/shared/components/shared';
import ManageSubscriptionModal from './ManageSubscriptionModal';
import CancelSubscriptionModal from './CancelSubscriptionModal';

const SubscriptionsTab: React.FC = () => {
  const {
    data: subscription,
    isLoading: isSubscriptionLoading,
    refetch: refetchSubscription,
  } = useCurrentSubscription();
  const { data: plans = [], isLoading: isPlansLoading } = useSubscriptionPlans();
  const { data: transactions = [], isLoading: isTransactionsLoading } = useTransactionHistory();
  const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription();

  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isLoading = isSubscriptionLoading || isPlansLoading || isTransactionsLoading;

  // Show success message when subscription is canceled
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('canceled') === 'true') {
      setSuccessMessage('Subscription plan canceled successfully');
      setShowSuccessMessage(true);
    }
  }, []);

  const handleManageSubscription = useCallback(() => {
    setIsManageModalOpen(true);
  }, []);

  const handleCancelClick = useCallback(() => {
    setIsCancelModalOpen(true);
  }, []);

  const handleCancelConfirm = useCallback(() => {
    cancelSubscription(undefined, {
      onSuccess: () => {
        setIsCancelModalOpen(false);
        setSuccessMessage('Subscription plan canceled successfully');
        setShowSuccessMessage(true);
        refetchSubscription();
      },
    });
  }, [cancelSubscription, refetchSubscription]);

  const handleRenewSubscription = useCallback(() => {
    setIsManageModalOpen(true);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingState message="Loading subscription..." />;
  }

  const isActive = subscription?.status === 'active';
  const isInactive = subscription?.status === 'canceled' || subscription?.status === 'expired';

  return (
    <Stack spacing={3}>
      {/* Success Message Banner */}
      {showSuccessMessage && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid #22c55e',
            bgcolor: '#ecfdf3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography sx={{ color: '#15803d', fontWeight: 700 }}>{successMessage}</Typography>
          <IconButton
            size="small"
            onClick={() => setShowSuccessMessage(false)}
            sx={{ color: '#16a34a' }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Paper>
      )}

      {/* Active/Inactive Plan Section */}
      {subscription ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 2,
            border: '1px solid #e5e7eb',
            bgcolor: '#fffbfb',
          }}
        >
          <Stack spacing={1.5}>
            <Chip
              label={isActive ? 'Active Plan' : 'Inactive Plan'}
              sx={{
                bgcolor: isActive ? '#e7f7e5' : '#fdecea',
                color: isActive ? '#15803d' : '#b91c1c',
                fontWeight: 700,
                width: 'fit-content',
              }}
            />
            <Typography variant="h5" sx={{ color: '#15803d', fontWeight: 700 }}>
              {subscription.planName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {isActive ? 'Renewal Date:' : 'Canceled:'} {formatDate(subscription.renewalDate)}
            </Typography>
            <Button
              variant="text"
              endIcon={<ArrowForward />}
              onClick={handleManageSubscription}
              sx={{
                color: '#15803d',
                textTransform: 'none',
                fontWeight: 700,
                width: 'fit-content',
                px: 0,
                '&:hover': { color: '#166534', bgcolor: 'transparent' },
              }}
            >
              Manage Subscription
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            You don&apos;t have an active subscription
          </Typography>
          <Button
            variant="contained"
            onClick={handleManageSubscription}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#15803d',
              '&:hover': { bgcolor: '#166534' },
            }}
          >
            View Plans
          </Button>
        </Paper>
      )}

      {/* Cancel / Renew Button */}
      {isActive && (
        <Button
          variant="outlined"
          fullWidth
          onClick={handleCancelClick}
          disabled={isCancelling}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            color: '#b91c1c',
            borderColor: '#b91c1c',
            borderWidth: 2,
            borderRadius: 1.5,
            py: 1.4,
            '&:hover': { bgcolor: '#fef2f2', borderColor: '#991b1b' },
          }}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
        </Button>
      )}

      {isInactive && (
        <Button
          variant="outlined"
          fullWidth
          onClick={handleRenewSubscription}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            color: '#15803d',
            borderColor: '#22c55e',
            borderWidth: 2,
            borderRadius: 1.5,
            py: 1.4,
            '&:hover': { bgcolor: '#f0fdf4', borderColor: '#16a34a' },
          }}
        >
          Renew Subscription
        </Button>
      )}

      {/* Transaction History */}
      {transactions.length > 0 && (
        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Transaction History
          </Typography>
          <Stack divider={<Divider />}>
            {transactions.map((transaction) => (
              <Box
                key={transaction.id}
                sx={{
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#374151' }}>
                    {formatDate(transaction.date)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.status === 'successful' ? 'Successful' : transaction.status}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#1f2937' }}>
                  ${transaction.amount}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Modals */}
      <ManageSubscriptionModal
        open={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        currentSubscription={subscription}
        plans={plans}
        onSubscriptionChange={() => {
          refetchSubscription();
          setIsManageModalOpen(false);
        }}
      />

      <CancelSubscriptionModal
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        isPending={isCancelling}
      />
    </Stack>
  );
};

export default SubscriptionsTab;
