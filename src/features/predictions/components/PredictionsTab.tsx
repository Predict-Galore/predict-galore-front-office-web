/**
 * Predictions Tab Component
 * Shows betting markets with sub-tabs (All, HF/FT, Scorers, Goals, Corners)
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Info, KeyboardArrowUp, Lock } from '@mui/icons-material';
import { Box, Stack, Paper, Button, Typography, IconButton } from '@mui/material';
import { BettingMarket } from '../model/types';
import { useCurrentSubscription } from '@/features/profile';
import PremiumSubscriptionModal from './PremiumSubscriptionModal';

interface PredictionsTabProps {
  odds: BettingMarket[];
  isLoading: boolean;
  activeSubTab: 'all' | 'hf-ft' | 'scorers' | 'goals' | 'corners';
  onSubTabChange: (tab: 'all' | 'hf-ft' | 'scorers' | 'goals' | 'corners') => void;
}

const PredictionsTab: React.FC<PredictionsTabProps> = ({
  odds,
  isLoading,
  activeSubTab,
  onSubTabChange,
}) => {
  const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set(['1x2']));
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const { data: subscription } = useCurrentSubscription();

  // Check if user has active premium subscription
  const isPremium =
    subscription?.status === 'active' &&
    (subscription.planCode.toLowerCase().includes('premium') ||
      subscription.planCode.toLowerCase().includes('yearly') ||
      subscription.planCode.toLowerCase().includes('monthly'));

  const subTabs = [
    { id: 'all', label: 'All' },
    { id: 'hf-ft', label: 'HF/FT' },
    { id: 'scorers', label: 'Scorers' },
    { id: 'goals', label: 'Goals' },
    { id: 'corners', label: 'Corners' },
  ] as const;

  const filteredOdds = useMemo(() => {
    if (activeSubTab === 'all') return odds;
    if (activeSubTab === 'scorers') return []; // Scorers handled separately
    return odds.filter((market) => {
      if (activeSubTab === 'goals') return market.type === 'goals';
      // Note: corners type may not exist in BettingMarketType, filter by name if needed
      return true;
    });
  }, [odds, activeSubTab]);

  const toggleMarket = (marketId: string) => {
    setExpandedMarkets((prev) => {
      const next = new Set(prev);
      if (next.has(marketId)) {
        next.delete(marketId);
      } else {
        next.add(marketId);
      }
      return next;
    });
  };

  const formatOdds = (value?: number) => {
    if (!value) return '-';
    return value.toFixed(2);
  };

  const handleOpenPremiumModal = useCallback(() => {
    setIsPremiumModalOpen(true);
  }, []);

  const handleClosePremiumModal = useCallback(() => {
    setIsPremiumModalOpen(false);
  }, []);

  const handleSubscribe = useCallback(
    (planId: number) => {
      // TODO: Implement subscription logic
      console.log('Subscribing to plan:', planId);
      handleClosePremiumModal();
      // Optionally refresh subscription status or redirect to payment
    },
    [handleClosePremiumModal]
  );

  // If user is premium and on scorers tab, show actual scorer predictions (when available)
  // For now, we'll show locked content for non-premium users
  if (activeSubTab === 'scorers') {
    return (
      <>
        <Stack spacing={2}>
          {/* Sub-tabs */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              pb: 1,
            }}
          >
            {subTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeSubTab === tab.id ? 'contained' : 'outlined'}
                size="small"
                onClick={() => onSubTabChange(tab.id)}
                sx={{
                  borderRadius: '50px',
                  px: { xs: 2, sm: 2.5 },
                  py: 1,
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                  ...(activeSubTab === tab.id
                    ? {
                        bgcolor: 'white',
                        color: 'success.main',
                        borderColor: 'success.main',
                        boxShadow: 1,
                      }
                    : {
                        bgcolor: 'grey.100',
                        color: 'grey.700',
                        borderColor: 'grey.300',
                        '&:hover': {
                          bgcolor: 'grey.200',
                        },
                      }),
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Box>

          {/* Show locked content only if user is not premium */}
          {!isPremium ? (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                bgcolor: 'white',
                p: 4,
                textAlign: 'center',
                boxShadow: 1,
              }}
            >
              <Lock sx={{ fontSize: 64, color: 'success.main', mx: 'auto', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Unlock Goal Scorer Predictions
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Get exclusive insights into top players, compare stats and access exclusive
                performance predictions.
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={handleOpenPremiumModal}
                sx={{ px: 3, py: 1.5 }}
              >
                Get premium access
              </Button>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                bgcolor: 'white',
                p: 4,
                textAlign: 'center',
                boxShadow: 1,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Goal scorer predictions will be displayed here.
              </Typography>
            </Paper>
          )}
        </Stack>

        <PremiumSubscriptionModal
          isOpen={isPremiumModalOpen}
          onClose={handleClosePremiumModal}
          onSubscribe={handleSubscribe}
        />
      </>
    );
  }

  return (
    <Stack spacing={2}>
      {/* Sub-tabs */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1,
        }}
      >
        {subTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeSubTab === tab.id ? 'contained' : 'outlined'}
            size="small"
            onClick={() => onSubTabChange(tab.id)}
            sx={{
              borderRadius: '50px',
              px: { xs: 2, sm: 2.5 },
              py: 1,
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              ...(activeSubTab === tab.id
                ? {
                    bgcolor: 'white',
                    color: 'success.main',
                    borderColor: 'success.main',
                    boxShadow: 1,
                  }
                : {
                    bgcolor: 'grey.100',
                    color: 'grey.700',
                    borderColor: 'grey.300',
                    '&:hover': {
                      bgcolor: 'grey.200',
                    },
                  }),
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>

      {/* Betting Markets */}
      {isLoading ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200',
            bgcolor: 'white',
            p: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 1, width: '75%' }} />
            <Box sx={{ height: 80, bgcolor: 'grey.200', borderRadius: 1 }} />
          </Box>
        </Paper>
      ) : filteredOdds.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200',
            bgcolor: 'white',
            p: 4,
            textAlign: 'center',
            boxShadow: 1,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No betting markets available for this match.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {filteredOdds.map((market) => {
            const isExpanded = expandedMarkets.has(market.id);

            return (
              <Paper
                key={market.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  bgcolor: 'white',
                  overflow: 'hidden',
                  boxShadow: 1,
                }}
              >
                {/* Market Header */}
                <IconButton
                  onClick={() => toggleMarket(market.id)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 2, sm: 2.5 },
                    py: 2,
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: 'grey.50',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
                      {market.name}
                    </Typography>
                    <Info sx={{ fontSize: 16, color: 'grey.400' }} />
                  </Box>
                  <KeyboardArrowUp
                    sx={{
                      fontSize: 20,
                      color: 'grey.400',
                      transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </IconButton>

                {/* Market Content */}
                {isExpanded && (
                  <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: { xs: 2, sm: 2.5 } }}>
                    {market.type === 'goals' && market.odds.over !== undefined ? (
                      <Stack spacing={1}>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: 1,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'grey.600',
                            mb: 1,
                          }}
                        >
                          <Box>Goal Line</Box>
                          <Box sx={{ textAlign: 'center' }}>Over</Box>
                          <Box sx={{ textAlign: 'center' }}>Under</Box>
                        </Box>
                        {[1.5, 2.5, 3.5, 4.5].map((line) => (
                          <Box
                            key={line}
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr 1fr',
                              gap: 1,
                              fontSize: '0.875rem',
                            }}
                          >
                            <Box sx={{ fontWeight: 500 }}>{line}</Box>
                            <Box sx={{ textAlign: 'center', fontWeight: 'semibold', color: 'grey.800' }}>
                              {formatOdds(market.odds.over)}
                            </Box>
                            <Box sx={{ textAlign: 'center', fontWeight: 'semibold', color: 'grey.800' }}>
                              {formatOdds(market.odds.under)}
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    ) : market.type === 'both-teams-score' ? (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 2,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            textAlign: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Yes
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                            {formatOdds(market.odds.yes)}
                          </Typography>
                        </Paper>
                        <Paper
                          elevation={0}
                          sx={{
                            textAlign: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            No
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                            {formatOdds(market.odds.no)}
                          </Typography>
                        </Paper>
                      </Box>
                    ) : market.type === 'first-goal' ? (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: 2,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            textAlign: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Home
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                            {formatOdds(market.odds.home)}
                          </Typography>
                        </Paper>
                        <Paper
                          elevation={0}
                          sx={{
                            textAlign: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            None
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                            {formatOdds(market.odds.none)}
                          </Typography>
                        </Paper>
                        <Paper
                          elevation={0}
                          sx={{
                            textAlign: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Away
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                            {formatOdds(market.odds.away)}
                          </Typography>
                        </Paper>
                      </Box>
                    ) : market.type === 'double-chance' ? (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: 2,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            textAlign: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Home or Draw
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                            {formatOdds(market.odds.homeOrDraw)}
                          </Typography>
                        </Paper>
                        <Paper
                          elevation={0}
                          sx={{
                            textAlign: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Home or Away
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                            {formatOdds(market.odds.homeOrAway)}
                          </Typography>
                        </Paper>
                        <Paper
                          elevation={0}
                          sx={{
                            textAlign: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Draw or Away
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                            {formatOdds(market.odds.drawOrAway)}
                          </Typography>
                        </Paper>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                          gap: 2,
                        }}
                      >
                        {market.odds.home !== undefined && (
                          <Paper
                            elevation={0}
                            sx={{
                              textAlign: 'center',
                              p: 1.5,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'grey.200',
                            }}
                          >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Home
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                              {formatOdds(market.odds.home)}
                            </Typography>
                          </Paper>
                        )}
                        {market.odds.draw !== undefined && (
                          <Paper
                            elevation={0}
                            sx={{
                              textAlign: 'center',
                              p: 1.5,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'grey.200',
                            }}
                          >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Draw
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                              {formatOdds(market.odds.draw)}
                            </Typography>
                          </Paper>
                        )}
                        {market.odds.away !== undefined && (
                          <Paper
                            elevation={0}
                            sx={{
                              textAlign: 'center',
                              p: 1.5,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'grey.200',
                            }}
                          >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Away
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                              {formatOdds(market.odds.away)}
                            </Typography>
                          </Paper>
                        )}
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default PredictionsTab;
