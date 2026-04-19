/**
 * SubscriptionsTab Component
 *
 * Displays the user's current active subscription.
 * Endpoint: GET /api/v1/subscriptions/users/{userId}/current
 *
 * States handled:
 *  - Loading  → skeleton cards
 *  - Error    → error message + retry button
 *  - Empty    → "No active subscription" message + "Subscribe" button
 *               → opens PlansModal which fetches GET /api/v1/subscriptions/plans?onlyActive=true
 *  - Data     → subscription detail card
 */

'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import {
  CalendarToday,
  CheckCircle,
  Close,
  CreditCard,
  ErrorOutline,
  Inbox,
  Refresh,
  Star,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useAuthStore } from '@/features/auth/model/store';
import { useCurrentSubscription, useSubscriptionPlans } from '@/features/profile';
import type { UserSubscription, SubscriptionPlan } from '@/features/profile/model/types';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Format a number as Nigerian Naira */
function formatNaira(amount: number): string {
  return `₦${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

/** Format an ISO date string to a readable date */
function formatDate(iso: string): string {
  if (!iso) return '—';
  return dayjs(iso).format('DD MMM YYYY');
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

const SubscriptionSkeleton: React.FC = () => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
    <Stack spacing={2}>
      <Skeleton variant="text" width={180} height={32} />
      <Skeleton variant="rounded" height={48} />
      <Skeleton variant="rounded" height={48} />
      <Skeleton variant="rounded" height={48} />
      <Skeleton variant="rounded" height={48} />
    </Stack>
  </Paper>
);

// ─── Info row ────────────────────────────────────────────────────────────────

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    justifyContent="space-between"
    alignItems={{ xs: 'flex-start', sm: 'center' }}
    sx={{ py: 1.25, px: 1.5, borderRadius: 1.5, bgcolor: 'grey.50' }}
  >
    <Typography variant="body2" color="text.secondary" fontWeight={600}>
      {label}
    </Typography>
    <Box>{value}</Box>
  </Stack>
);

// ─── Subscription detail card ────────────────────────────────────────────────

const SubscriptionCard: React.FC<{ subscription: UserSubscription }> = ({ subscription }) => {
  const statusColor = subscription.isActive ? 'success' : 'default';

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2.5}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Star sx={{ color: 'warning.main', fontSize: 22 }} />
            <Typography variant="h6" fontWeight={800}>
              {subscription.planName || subscription.planCode}
            </Typography>
          </Stack>
          <Chip
            label={subscription.isActive ? 'Active' : subscription.status || 'Inactive'}
            color={statusColor}
            size="small"
            icon={subscription.isActive ? <CheckCircle sx={{ fontSize: '14px !important' }} /> : undefined}
            sx={{ fontWeight: 700, textTransform: 'capitalize' }}
          />
        </Stack>

        <Divider />

        {/* Details */}
        <Stack spacing={1.25}>
          <InfoRow
            label="Plan"
            value={
              <Typography variant="body2" fontWeight={700}>
                {subscription.planName}
              </Typography>
            }
          />
          <InfoRow
            label="Amount"
            value={
              <Typography variant="body2" fontWeight={700} color="success.main">
                {formatNaira(subscription.amount)}
              </Typography>
            }
          />
          <InfoRow
            label="Duration"
            value={
              <Typography variant="body2" fontWeight={700}>
                {subscription.durationDays} days
              </Typography>
            }
          />
          <InfoRow
            label="Start Date"
            value={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight={700}>
                  {formatDate(subscription.startDate)}
                </Typography>
              </Stack>
            }
          />
          <InfoRow
            label="End Date"
            value={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight={700}>
                  {formatDate(subscription.endDate)}
                </Typography>
              </Stack>
            }
          />
          <InfoRow
            label="Auto Renew"
            value={
              <Chip
                label={subscription.autoRenew ? 'Yes' : 'No'}
                size="small"
                color={subscription.autoRenew ? 'success' : 'default'}
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            }
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

// ─── Plans modal ─────────────────────────────────────────────────────────────

interface PlansModalProps {
  open: boolean;
  onClose: () => void;
}

const PlansModal: React.FC<PlansModalProps> = ({ open, onClose }) => {
  const {
    data: plans = [],
    isLoading,
    isError,
    refetch,
  } = useSubscriptionPlans(true);

  const safePlans: SubscriptionPlan[] = Array.isArray(plans) ? plans : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle
        component="div"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 1.5 }}
      >
        <Box>
          <Typography variant="h6" fontWeight={800}>
            Choose a Plan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a subscription plan to get started
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {/* Loading */}
        {isLoading && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            {[1, 2].map((i) => (
              <Skeleton key={i} variant="rounded" height={96} />
            ))}
          </Stack>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
            <ErrorOutline sx={{ fontSize: 48, color: 'error.main' }} />
            <Typography color="text.secondary">Failed to load plans.</Typography>
            <Button variant="outlined" startIcon={<Refresh />} onClick={() => refetch()}>
              Retry
            </Button>
          </Stack>
        )}

        {/* Empty */}
        {!isLoading && !isError && safePlans.length === 0 && (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 4 }}>
            <Inbox sx={{ fontSize: 48, color: 'text.disabled' }} />
            <Typography color="text.secondary">No plans available at the moment.</Typography>
          </Stack>
        )}

        {/* Plans list */}
        {!isLoading && !isError && safePlans.length > 0 && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            {safePlans.map((plan) => (
              <Paper
                key={plan.id}
                elevation={0}
                sx={{
                  p: 2.5,
                  border: '2px solid',
                  borderColor: plan.planCode === 'PREMIUM_MONTHLY' ? 'success.main' : 'divider',
                  borderRadius: 2,
                  position: 'relative',
                  bgcolor: plan.planCode === 'PREMIUM_MONTHLY' ? 'success.50' : 'background.paper',
                }}
              >
                {plan.planCode === 'PREMIUM_MONTHLY' && (
                  <Chip
                    label="Recommended"
                    size="small"
                    color="success"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: 16,
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />
                )}

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {plan.name}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="success.main" sx={{ mt: 0.5 }}>
                      {formatNaira(plan.amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {plan.durationDays} days
                    </Typography>
                  </Box>

                  <Button
                    variant={plan.amount === 0 ? 'outlined' : 'contained'}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      bgcolor: plan.amount === 0 ? undefined : 'success.main',
                      '&:hover': { bgcolor: plan.amount === 0 ? undefined : 'success.dark' },
                    }}
                    onClick={() => {
                      // TODO: wire up payment / subscription flow
                      onClose();
                    }}
                  >
                    {plan.amount === 0 ? 'Get Free' : 'Subscribe'}
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ─── Main component ──────────────────────────────────────────────────────────

const SubscriptionsTab: React.FC = () => {
  const [plansModalOpen, setPlansModalOpen] = useState(false);

  // Get the logged-in user's ID from the auth store
  const userId = useAuthStore((state) => state.user?.id ?? null);

  const {
    data: subscription,
    isLoading,
    isError,
    refetch,
  } = useCurrentSubscription(userId);

  // ── Loading ──
  if (isLoading) {
    return <SubscriptionSkeleton />;
  }

  // ── Error ──
  if (isError) {
    return (
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
        <ErrorOutline sx={{ fontSize: 48, color: 'error.main', mb: 1.5 }} />
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Unable to load subscription
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Something went wrong while fetching your subscription details.
        </Typography>
        <Button variant="outlined" startIcon={<Refresh />} onClick={() => refetch()}>
          Try again
        </Button>
      </Paper>
    );
  }

  // ── Empty (no active subscription) ──
  if (!subscription) {
    return (
      <>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <CreditCard sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            No active subscription
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: 'auto' }}>
            You don't have an active subscription yet. Subscribe to unlock premium predictions and features.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setPlansModalOpen(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: 'success.main',
              px: 4,
              '&:hover': { bgcolor: 'success.dark' },
            }}
          >
            View Plans & Subscribe
          </Button>
        </Paper>

        <PlansModal open={plansModalOpen} onClose={() => setPlansModalOpen(false)} />
      </>
    );
  }

  // ── Data ──
  return (
    <Stack spacing={3}>
      <SubscriptionCard subscription={subscription} />

      {/* Allow upgrading / changing plan */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => setPlansModalOpen(true)}
          sx={{ textTransform: 'none', fontWeight: 700, borderColor: 'success.main', color: 'success.main' }}
        >
          Change Plan
        </Button>
      </Box>

      <PlansModal open={plansModalOpen} onClose={() => setPlansModalOpen(false)} />
    </Stack>
  );
};

export default SubscriptionsTab;
