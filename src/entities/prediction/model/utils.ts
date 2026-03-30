/**
 * PREDICTION ENTITY - Utility Functions
 *
 * Common utility functions for Prediction entity operations
 */

import {
  Prediction,
  PredictionStatus,
  PredictionType,
  PredictionSource,
  PredictionStats,
  HeadToHeadAnalysis,
  FormData,
  GameResult,
  MotivationFactors,
  WeatherImpact,
  InjuryReport,
  BankrollInfo,
  StakingStrategy,
  TypeStats,
  SourceStats,
} from './types';

const PREDICTION_TYPES: PredictionType[] = [
  'match_result',
  'over_under',
  'both_teams_score',
  'correct_score',
  'handicap',
  'double_chance',
  'first_goal_scorer',
  'anytime_scorer',
  'clean_sheet',
  'corners',
  'cards',
  'halftime_result',
  'combo',
  'custom',
] as const;

const PREDICTION_SOURCES: PredictionSource[] = [
  'ai_algorithm',
  'expert_tipster',
  'community',
  'statistical_model',
  'machine_learning',
  'hybrid',
] as const;

/**
 * Check if prediction is active (match is live)
 */
export function isPredictionActive(prediction: Prediction): boolean {
  return prediction.status === 'active';
}

/**
 * Check if prediction is pending (waiting for match to start)
 */
export function isPredictionPending(prediction: Prediction): boolean {
  return prediction.status === 'pending';
}

/**
 * Check if prediction is settled (has a result)
 */
export function isPredictionSettled(prediction: Prediction): boolean {
  return ['won', 'lost', 'void', 'pushed'].includes(prediction.status);
}

/**
 * Check if prediction won
 */
export function isPredictionWon(prediction: Prediction): boolean {
  return prediction.status === 'won';
}

/**
 * Check if prediction lost
 */
export function isPredictionLost(prediction: Prediction): boolean {
  return prediction.status === 'lost';
}

/**
 * Check if prediction was voided
 */
export function isPredictionVoid(prediction: Prediction): boolean {
  return prediction.status === 'void';
}

/**
 * Check if prediction was pushed (stake returned)
 */
export function isPredictionPushed(prediction: Prediction): boolean {
  return prediction.status === 'pushed';
}

/**
 * Get prediction confidence level
 */
export function getConfidenceLevel(
  confidence: number
): 'very_low' | 'low' | 'medium' | 'high' | 'very_high' {
  if (confidence >= 90) return 'very_high';
  if (confidence >= 75) return 'high';
  if (confidence >= 50) return 'medium';
  if (confidence >= 25) return 'low';
  return 'very_low';
}

/**
 * Get prediction odds category
 */
export function getOddsCategory(
  odds?: number
): 'short' | 'medium' | 'long' | 'very_long' | 'unknown' {
  if (!odds) return 'unknown';

  if (odds <= 1.5) return 'short';
  if (odds <= 3.0) return 'medium';
  if (odds <= 10.0) return 'long';
  return 'very_long';
}

/**
 * Calculate implied probability from odds
 */
export function calculateImpliedProbability(odds: number): number {
  return Math.round((1 / odds) * 100 * 100) / 100;
}

/**
 * Calculate potential return from stake and odds
 */
export function calculatePotentialReturn(stake: number, odds: number): number {
  return Math.round(stake * odds * 100) / 100;
}

/**
 * Calculate potential profit from stake and odds
 */
export function calculatePotentialProfit(stake: number, odds: number): number {
  return Math.round((stake * odds - stake) * 100) / 100;
}

/**
 * Calculate actual profit from prediction result
 */
export function calculateActualProfit(prediction: Prediction): number {
  if (!prediction.result || !prediction.stake) return 0;

  switch (prediction.result.outcome) {
    case 'won':
      return (
        prediction.result.profit || calculatePotentialProfit(prediction.stake, prediction.odds || 1)
      );
    case 'lost':
      return -prediction.stake;
    case 'void':
    case 'pushed':
      return 0;
    default:
      return 0;
  }
}

/**
 * Calculate ROI (Return on Investment) for a prediction
 */
export function calculatePredictionROI(prediction: Prediction): number {
  if (!prediction.stake || prediction.stake === 0) return 0;

  const profit = calculateActualProfit(prediction);
  return Math.round((profit / prediction.stake) * 100 * 100) / 100;
}

/**
 * Get prediction type display name
 */
export function getPredictionTypeDisplayName(type: PredictionType): string {
  const typeNames: Record<PredictionType, string> = {
    match_result: 'Match Result (1X2)',
    over_under: 'Over/Under Goals',
    both_teams_score: 'Both Teams to Score',
    correct_score: 'Correct Score',
    handicap: 'Asian Handicap',
    double_chance: 'Double Chance',
    first_goal_scorer: 'First Goal Scorer',
    anytime_scorer: 'Anytime Goal Scorer',
    clean_sheet: 'Clean Sheet',
    corners: 'Corner Kicks',
    cards: 'Cards',
    halftime_result: 'Half Time Result',
    combo: 'Combination Bet',
    custom: 'Custom Prediction',
  };

  return typeNames[type] || type;
}

/**
 * Get prediction source display name
 */
export function getPredictionSourceDisplayName(source: PredictionSource): string {
  const sourceNames: Record<PredictionSource, string> = {
    ai_algorithm: 'AI Algorithm',
    expert_tipster: 'Expert Tipster',
    community: 'Community',
    statistical_model: 'Statistical Model',
    machine_learning: 'Machine Learning',
    hybrid: 'Hybrid Model',
  };

  return sourceNames[source] || source;
}

/**
 * Check if prediction is high confidence
 */
export function isHighConfidencePrediction(prediction: Prediction): boolean {
  return prediction.confidence >= 75;
}

/**
 * Check if prediction is premium
 */
export function isPremiumPrediction(prediction: Prediction): boolean {
  return prediction.metadata.premium;
}

/**
 * Check if prediction is featured
 */
export function isFeaturedPrediction(prediction: Prediction): boolean {
  return prediction.metadata.featured;
}

/**
 * Check if prediction is trending
 */
export function isTrendingPrediction(prediction: Prediction): boolean {
  return prediction.metadata.trending;
}

/**
 * Get prediction difficulty level
 */
export function getPredictionDifficulty(prediction: Prediction): string {
  const difficultyNames = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
  };

  return difficultyNames[prediction.metadata.difficulty] || prediction.metadata.difficulty;
}

/**
 * Calculate value bet score (confidence vs implied probability)
 */
export function calculateValueBetScore(prediction: Prediction): number {
  if (!prediction.odds) return 0;

  const impliedProbability = calculateImpliedProbability(prediction.odds);
  const confidenceProbability = prediction.confidence;

  return Math.round((confidenceProbability - impliedProbability) * 100) / 100;
}

/**
 * Check if prediction is a value bet
 */
export function isValueBet(prediction: Prediction): boolean {
  return calculateValueBetScore(prediction) > 5; // 5% edge threshold
}

/**
 * Get time until match starts (in minutes)
 */
export function getTimeUntilMatch(prediction: Prediction): number {
  const now = new Date();
  const matchTime = new Date(prediction.match.scheduledAt);
  return Math.max(0, Math.floor((matchTime.getTime() - now.getTime()) / (1000 * 60)));
}

/**
 * Check if match starts soon (within next hour)
 */
export function isMatchStartingSoon(prediction: Prediction): boolean {
  const timeUntil = getTimeUntilMatch(prediction);
  return timeUntil > 0 && timeUntil <= 60;
}

/**
 * Format prediction outcome display
 */
export function formatPredictionOutcome(prediction: Prediction): string {
  return prediction.outcome.display;
}

/**
 * Format prediction odds display
 */
export function formatOddsDisplay(odds?: number): string {
  if (!odds) return 'N/A';
  return odds.toFixed(2);
}

/**
 * Format confidence display
 */
export function formatConfidenceDisplay(confidence: number): string {
  return `${confidence}%`;
}

/**
 * Format stake display
 */
export function formatStakeDisplay(stake?: number, currency: string = 'USD'): string {
  if (!stake) return 'N/A';
  return `${stake.toFixed(2)} ${currency}`;
}

/**
 * Format profit display
 */
export function formatProfitDisplay(profit: number, currency: string = 'USD'): string {
  const sign = profit >= 0 ? '+' : '';
  return `${sign}${profit.toFixed(2)} ${currency}`;
}

/**
 * Format ROI display
 */
export function formatROIDisplay(roi: number): string {
  const sign = roi >= 0 ? '+' : '';
  return `${sign}${roi.toFixed(1)}%`;
}

/**
 * Get team form strength
 */
export function getTeamFormStrength(
  form: FormData
): 'very_strong' | 'strong' | 'average' | 'weak' | 'very_weak' {
  const winPercentage = form.winPercentage;

  if (winPercentage >= 80) return 'very_strong';
  if (winPercentage >= 60) return 'strong';
  if (winPercentage >= 40) return 'average';
  if (winPercentage >= 20) return 'weak';
  return 'very_weak';
}

/**
 * Compare team forms
 */
export function compareTeamForms(
  homeForm: FormData,
  awayForm: FormData
): 'home_advantage' | 'away_advantage' | 'balanced' {
  const homePts = calculateFormPoints(homeForm.last5Games);
  const awayPts = calculateFormPoints(awayForm.last5Games);

  const difference = homePts - awayPts;

  if (difference >= 3) return 'home_advantage';
  if (difference <= -3) return 'away_advantage';
  return 'balanced';
}

/**
 * Calculate form points from recent games
 */
export function calculateFormPoints(games: GameResult[]): number {
  return games.reduce((points, game) => {
    switch (game.result) {
      case 'W':
        return points + 3;
      case 'D':
        return points + 1;
      case 'L':
        return points + 0;
      default:
        return points;
    }
  }, 0);
}

/**
 * Get head-to-head advantage
 */
export function getHeadToHeadAdvantage(
  h2h: HeadToHeadAnalysis
): 'home_advantage' | 'away_advantage' | 'balanced' {
  const homeWinRate = (h2h.homeTeamWins / h2h.totalMeetings) * 100;
  const awayWinRate = (h2h.awayTeamWins / h2h.totalMeetings) * 100;

  const difference = homeWinRate - awayWinRate;

  if (difference >= 20) return 'home_advantage';
  if (difference <= -20) return 'away_advantage';
  return 'balanced';
}

/**
 * Calculate injury impact score
 */
export function calculateInjuryImpact(injuries: InjuryReport[]): number {
  return injuries.reduce((total, injury) => {
    const importanceMultiplier = {
      key: 3,
      regular: 2,
      squad: 1,
    };

    return total + injury.impact * importanceMultiplier[injury.importance];
  }, 0);
}

/**
 * Get weather impact on match
 */
export function getWeatherImpactLevel(weather: WeatherImpact): 'high' | 'medium' | 'low' {
  if (weather.impact === 'positive' || weather.impact === 'negative') {
    if (weather.windSpeed > 30 || weather.precipitation > 70) return 'high';
    if (weather.windSpeed > 15 || weather.precipitation > 30) return 'medium';
  }
  return 'low';
}

/**
 * Calculate motivation advantage
 */
export function calculateMotivationAdvantage(motivation: MotivationFactors): number {
  return motivation.homeTeam.impact - motivation.awayTeam.impact;
}

/**
 * Get overall prediction strength
 */
export function getPredictionStrength(
  prediction: Prediction
): 'very_strong' | 'strong' | 'moderate' | 'weak' {
  let score = 0;

  // Confidence score (0-40 points)
  score += (prediction.confidence / 100) * 40;

  // Value bet score (0-20 points)
  const valueBetScore = calculateValueBetScore(prediction);
  if (valueBetScore > 0) {
    score += Math.min(valueBetScore, 20);
  }

  // Analysis depth score (0-20 points)
  if (prediction.analysis) {
    const analysisFactors = [
      prediction.analysis.historicalData,
      prediction.analysis.teamForm,
      prediction.analysis.headToHead,
      prediction.analysis.injuries,
      prediction.analysis.weather,
      prediction.analysis.motivation,
    ].filter(Boolean).length;

    score += (analysisFactors / 6) * 20;
  }

  // Algorithm reliability score (0-20 points)
  if (prediction.algorithm) {
    score += (prediction.algorithm.accuracy / 100) * 20;
  }

  if (score >= 80) return 'very_strong';
  if (score >= 60) return 'strong';
  if (score >= 40) return 'moderate';
  return 'weak';
}

/**
 * Filter predictions by status
 */
export function filterPredictionsByStatus(
  predictions: Prediction[],
  status: PredictionStatus
): Prediction[] {
  return predictions.filter((prediction) => prediction.status === status);
}

/**
 * Filter predictions by type
 */
export function filterPredictionsByType(
  predictions: Prediction[],
  type: PredictionType
): Prediction[] {
  return predictions.filter((prediction) => prediction.type === type);
}

/**
 * Filter predictions by source
 */
export function filterPredictionsBySource(
  predictions: Prediction[],
  source: PredictionSource
): Prediction[] {
  return predictions.filter((prediction) => prediction.source === source);
}

/**
 * Filter predictions by confidence range
 */
export function filterPredictionsByConfidence(
  predictions: Prediction[],
  minConfidence: number,
  maxConfidence: number
): Prediction[] {
  return predictions.filter(
    (prediction) => prediction.confidence >= minConfidence && prediction.confidence <= maxConfidence
  );
}

/**
 * Filter predictions by odds range
 */
export function filterPredictionsByOdds(
  predictions: Prediction[],
  minOdds: number,
  maxOdds: number
): Prediction[] {
  return predictions.filter(
    (prediction) => prediction.odds && prediction.odds >= minOdds && prediction.odds <= maxOdds
  );
}

/**
 * Sort predictions by confidence (highest first by default)
 */
export function sortPredictionsByConfidence(
  predictions: Prediction[],
  ascending: boolean = false
): Prediction[] {
  return [...predictions].sort((a, b) => {
    return ascending ? a.confidence - b.confidence : b.confidence - a.confidence;
  });
}

/**
 * Sort predictions by odds (lowest first by default)
 */
export function sortPredictionsByOdds(
  predictions: Prediction[],
  ascending: boolean = true
): Prediction[] {
  return [...predictions].sort((a, b) => {
    const oddsA = a.odds || 0;
    const oddsB = b.odds || 0;
    return ascending ? oddsA - oddsB : oddsB - oddsA;
  });
}

/**
 * Sort predictions by creation date (newest first by default)
 */
export function sortPredictionsByDate(
  predictions: Prediction[],
  ascending: boolean = false
): Prediction[] {
  return [...predictions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Get pending predictions
 */
export function getPendingPredictions(predictions: Prediction[]): Prediction[] {
  return predictions.filter(isPredictionPending);
}

/**
 * Get active predictions
 */
export function getActivePredictions(predictions: Prediction[]): Prediction[] {
  return predictions.filter(isPredictionActive);
}

/**
 * Get settled predictions
 */
export function getSettledPredictions(predictions: Prediction[]): Prediction[] {
  return predictions.filter(isPredictionSettled);
}

/**
 * Get winning predictions
 */
export function getWinningPredictions(predictions: Prediction[]): Prediction[] {
  return predictions.filter(isPredictionWon);
}

/**
 * Get losing predictions
 */
export function getLosingPredictions(predictions: Prediction[]): Prediction[] {
  return predictions.filter(isPredictionLost);
}

/**
 * Calculate portfolio statistics
 */
export function calculatePortfolioStats(predictions: Prediction[]): PredictionStats {
  const settledPredictions = getSettledPredictions(predictions);
  const wonPredictions = getWinningPredictions(settledPredictions);

  const totalPredictions = settledPredictions.length;
  const winRate = totalPredictions > 0 ? (wonPredictions.length / totalPredictions) * 100 : 0;

  const totalStaked = settledPredictions.reduce((sum, p) => sum + (p.stake || 0), 0);
  const totalProfit = settledPredictions.reduce((sum, p) => sum + calculateActualProfit(p), 0);
  const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;

  const averageOdds =
    settledPredictions.reduce((sum, p) => sum + (p.odds || 0), 0) / totalPredictions || 0;
  const averageConfidence =
    predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length || 0;

  // Calculate streaks
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const sortedPredictions = sortPredictionsByDate(settledPredictions, true);

  for (const prediction of sortedPredictions) {
    if (isPredictionWon(prediction)) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else if (isPredictionLost(prediction)) {
      tempStreak = 0;
    }
  }

  // Current streak (from most recent)
  const recentPredictions = sortPredictionsByDate(settledPredictions, false);
  for (const prediction of recentPredictions) {
    if (isPredictionWon(prediction)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Stats by type and source
  const byType: Record<PredictionType, TypeStats> = {} as Record<PredictionType, TypeStats>;
  const bySource: Record<PredictionSource, SourceStats> = {} as Record<
    PredictionSource,
    SourceStats
  >;

  // Group by type
  for (const type of PREDICTION_TYPES) {
    const typePredictions = filterPredictionsByType(settledPredictions, type);
    if (typePredictions.length > 0) {
      const typeWon = getWinningPredictions(typePredictions);
      const typeStaked = typePredictions.reduce((sum, p) => sum + (p.stake || 0), 0);
      const typeProfit = typePredictions.reduce((sum, p) => sum + calculateActualProfit(p), 0);

      byType[type] = {
        count: typePredictions.length,
        winRate: (typeWon.length / typePredictions.length) * 100,
        averageOdds:
          typePredictions.reduce((sum, p) => sum + (p.odds || 0), 0) / typePredictions.length,
        profit: typeProfit,
        roi: typeStaked > 0 ? (typeProfit / typeStaked) * 100 : 0,
      };
    }
  }

  // Group by source
  for (const source of PREDICTION_SOURCES) {
    const sourcePredictions = filterPredictionsBySource(settledPredictions, source);
    if (sourcePredictions.length > 0) {
      const sourceWon = getWinningPredictions(sourcePredictions);
      const sourceStaked = sourcePredictions.reduce((sum, p) => sum + (p.stake || 0), 0);
      const sourceProfit = sourcePredictions.reduce((sum, p) => sum + calculateActualProfit(p), 0);

      bySource[source] = {
        count: sourcePredictions.length,
        winRate: (sourceWon.length / sourcePredictions.length) * 100,
        averageConfidence:
          sourcePredictions.reduce((sum, p) => sum + p.confidence, 0) / sourcePredictions.length,
        profit: sourceProfit,
        roi: sourceStaked > 0 ? (sourceProfit / sourceStaked) * 100 : 0,
      };
    }
  }

  return {
    totalPredictions,
    winRate: Math.round(winRate * 100) / 100,
    averageOdds: Math.round(averageOdds * 100) / 100,
    averageConfidence: Math.round(averageConfidence * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    bestStreak,
    currentStreak,
    byType,
    bySource,
  };
}

/**
 * Calculate recommended stake based on Kelly Criterion
 */
export function calculateKellyStake(
  bankroll: number,
  odds: number,
  confidence: number,
  maxRiskPercentage: number = 5
): number {
  const probability = confidence / 100;
  const kellyPercentage = ((odds * probability - 1) / (odds - 1)) * 100;

  // Cap at max risk percentage
  const safePercentage = Math.min(Math.max(kellyPercentage, 0), maxRiskPercentage);

  return Math.round(((bankroll * safePercentage) / 100) * 100) / 100;
}

/**
 * Calculate recommended stake based on fixed percentage
 */
export function calculateFixedPercentageStake(bankroll: number, percentage: number): number {
  return Math.round(((bankroll * percentage) / 100) * 100) / 100;
}

/**
 * Calculate recommended stake based on confidence level
 */
export function calculateConfidenceBasedStake(
  bankroll: number,
  confidence: number,
  basePercentage: number = 2
): number {
  const confidenceMultiplier = confidence / 50; // Scale confidence to multiplier
  const adjustedPercentage = Math.min(basePercentage * confidenceMultiplier, 10); // Cap at 10%

  return Math.round(((bankroll * adjustedPercentage) / 100) * 100) / 100;
}

/**
 * Get recommended stake based on staking strategy
 */
export function getRecommendedStake(
  strategy: StakingStrategy,
  bankroll: number,
  prediction: Prediction
): number {
  switch (strategy.type) {
    case 'fixed':
      return strategy.baseAmount;

    case 'percentage':
      return calculateFixedPercentageStake(bankroll, strategy.riskPercentage || 2);

    case 'kelly':
      if (!prediction.odds) return strategy.baseAmount;
      return calculateKellyStake(
        bankroll,
        prediction.odds,
        prediction.confidence,
        strategy.riskPercentage || 5
      );

    default:
      return strategy.baseAmount;
  }
}

/**
 * Check if prediction meets risk management criteria
 */
export function meetsBankrollRiskCriteria(
  prediction: Prediction,
  bankroll: BankrollInfo,
  maxRiskPerBet: number
): boolean {
  if (!prediction.stake) return true;

  const riskPercentage = (prediction.stake / bankroll.current) * 100;
  return riskPercentage <= maxRiskPerBet;
}

/**
 * Format prediction summary for display
 */
export function formatPredictionSummary(prediction: Prediction): string {
  const matchName = `${prediction.match.homeTeam.shortName} vs ${prediction.match.awayTeam.shortName}`;
  const outcome = formatPredictionOutcome(prediction);
  const confidence = formatConfidenceDisplay(prediction.confidence);
  const odds = formatOddsDisplay(prediction.odds);

  return `${matchName} - ${outcome} (${confidence}, ${odds})`;
}
