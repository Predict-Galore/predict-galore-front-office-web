/**
 * Subscriptions Tab Component
 * Renders subscription plans list table and in-place plan details.
 */

'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useSubscriptionPlanById, useSubscriptionPlans } from '@/features/profile';

const SubscriptionsTab: React.FC = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const {
    data: plans = [],
    isLoading: isPlansLoading,
    isError: isPlansError,
    refetch: refetchPlans,
  } = useSubscriptionPlans(true);
  const safePlans = useMemo(() => (Array.isArray(plans) ? plans : []), [plans]);

  const {
    data: selectedPlan,
    isLoading: isPlanLoading,
    isError: isPlanError,
    refetch: refetchSelectedPlan,
  } = useSubscriptionPlanById(selectedPlanId, { enabled: selectedPlanId !== null });

  const selectedPlanSummary = useMemo(
    () => safePlans.find((plan) => plan.id === selectedPlanId) ?? null,
    [safePlans, selectedPlanId]
  );

  const formatAmount = (amount?: number) => {
    if (typeof amount !== 'number') return 'N/A';
    return `₦${new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  };

  const renderTableSkeleton = () => (
    <Paper
      elevation={0}
      sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200', p: 2 }}
    >
      <Stack spacing={1.25}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={`subscriptions-table-skeleton-${index}`} variant="rounded" height={46} />
        ))}
      </Stack>
    </Paper>
  );

  const renderListView = () => {
    if (isPlansLoading) return renderTableSkeleton();

    if (isPlansError) {
      return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Unable to load subscription plans.
          </Typography>
          <Button variant="outlined" onClick={() => refetchPlans()} sx={{ textTransform: 'none' }}>
            Retry
          </Button>
        </Paper>
      );
    }

    if (!safePlans.length) {
      return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No active subscription plans found.
          </Typography>
        </Paper>
      );
    }

    return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Duration Days</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Auto Renew Default</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safePlans.map((plan) => (
              <TableRow
                key={plan.id}
                hover
                onClick={() => setSelectedPlanId(plan.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.planCode}</TableCell>
                <TableCell>{formatAmount(plan.amount)}</TableCell>
                <TableCell>{plan.durationDays}</TableCell>
                <TableCell>{String(plan.autoRenewDefault)}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={plan.isActie ? 'Active' : 'Inactive'}
                    color={plan.isActie ? 'success' : 'default'}
                    variant={plan.isActie ? 'filled' : 'outlined'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderDetailSkeleton = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}
    >
      <Stack spacing={1.5}>
        <Skeleton variant="text" width={220} height={44} />
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={40} />
      </Stack>
    </Paper>
  );

  const renderDetailView = () => {
    if (isPlanLoading) return renderDetailSkeleton();

    if (isPlanError) {
      return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Unable to load the selected subscription plan.
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => setSelectedPlanId(null)}
              sx={{ textTransform: 'none' }}
            >
              Back to list
            </Button>
            <Button
              variant="contained"
              onClick={() => refetchSelectedPlan()}
              sx={{ textTransform: 'none' }}
            >
              Retry
            </Button>
          </Stack>
        </Paper>
      );
    }

    const plan = selectedPlan ?? selectedPlanSummary;

    if (!plan) {
      return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Subscription plan not found.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setSelectedPlanId(null)}
            sx={{ textTransform: 'none' }}
          >
            Back to list
          </Button>
        </Paper>
      );
    }

    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Stack spacing={2.25}>
          <Button
            startIcon={<ArrowBack />}
            variant="text"
            onClick={() => setSelectedPlanId(null)}
            sx={{ width: 'fit-content', px: 0, textTransform: 'none', fontWeight: 700 }}
          >
            Back to subscriptions list
          </Button>

          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {plan.name}
          </Typography>

          <Stack spacing={1.25}>
            <InfoRow label="Plan ID" value={String(plan.id)} />
            <InfoRow label="Plan Code" value={plan.planCode} />
            <InfoRow label="Amount" value={formatAmount(plan.amount)} />
            <InfoRow label="Duration Days" value={String(plan.durationDays)} />
            <InfoRow label="Auto Renew Default" value={String(plan.autoRenewDefault)} />
            <InfoRow label="Status" value={plan.isActie ? 'Active' : 'Inactive'} />
            {plan.description ? <InfoRow label="Description" value={plan.description} /> : null}
          </Stack>
        </Stack>
      </Paper>
    );
  };

  return <Box>{selectedPlanId === null ? renderListView() : renderDetailView()}</Box>;
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={{ xs: 0.5, sm: 2 }}
    sx={{
      py: 1.2,
      px: 1.5,
      borderRadius: 1.5,
      bgcolor: 'grey.50',
      justifyContent: 'space-between',
    }}
  >
    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>
      {value}
    </Typography>
  </Stack>
);

export default SubscriptionsTab;
