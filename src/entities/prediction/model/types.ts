/**
 * PREDICTION ENTITY - Domain Model
 *
 * Core prediction business entity for sports betting predictions
 */

export interface Prediction {
  id: string;
  matchId: string;
  match: MatchInfo;
  type: PredictionType;
  market: PredictionMarket;
  outcome: PredictionOutcome;
  confidence: number; // 0-100
  odds?: number;
  probability?: number; // 0-1
  stake?: number;
  potentialReturn?: number;
  status: PredictionStatus;
  reasoning?: string;
  analysis?: PredictionAnalysis;
  tags: string[];
  source: PredictionSource;
  algorithm?: AlgorithmInfo;
  createdAt: string;
  updatedAt: string;
  settledAt?: string;
  result?: PredictionResult;
  metadata: PredictionMetadata;
}

export interface MatchInfo {
  id: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  competition: string;
  scheduledAt: string;
  status: string;
  venue?: string;
}

export interface TeamInfo {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  form?: string;
  position?: number;
}

export type PredictionType =
  | 'match_result' // 1X2
  | 'over_under' // Total goals
  | 'both_teams_score' // BTTS
  | 'correct_score' // Exact score
  | 'handicap' // Asian handicap
  | 'double_chance' // 1X, X2, 12
  | 'first_goal_scorer' // Player to score first
  | 'anytime_scorer' // Player to score anytime
  | 'clean_sheet' // Team to keep clean sheet
  | 'corners' // Corner kicks
  | 'cards' // Yellow/red cards
  | 'halftime_result' // HT result
  | 'combo' // Multiple predictions combined
  | 'custom'; // Custom prediction type

export interface PredictionMarket {
  name: string;
  type: PredictionType;
  description: string;
  options: MarketOption[];
  handicap?: number;
  total?: number;
  period?: 'full_time' | 'first_half' | 'second_half';
}

export interface MarketOption {
  id: string;
  name: string;
  value: string;
  odds?: number;
  probability?: number;
}

export interface PredictionOutcome {
  selection: string;
  value: string | number;
  display: string;
  odds?: number;
  probability?: number;
}

export type PredictionStatus =
  | 'pending' // Waiting for match to start
  | 'active' // Match is live
  | 'won' // Prediction won
  | 'lost' // Prediction lost
  | 'void' // Prediction voided
  | 'pushed' // Stake returned
  | 'cancelled' // Match cancelled
  | 'suspended'; // Temporarily suspended

export interface PredictionAnalysis {
  keyFactors: string[];
  strengths: string[];
  risks: string[];
  historicalData?: HistoricalData;
  teamForm?: TeamFormAnalysis;
  headToHead?: HeadToHeadAnalysis;
  injuries?: InjuryReport[];
  weather?: WeatherImpact;
  motivation?: MotivationFactors;
}

export interface HistoricalData {
  totalMatches: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  averageGoals: number;
  bttsPercentage: number;
  over25Percentage: number;
  cleanSheetPercentage: number;
}

export interface TeamFormAnalysis {
  home: FormData;
  away: FormData;
  comparison: FormComparison;
}

export interface FormData {
  last5Games: GameResult[];
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  btts: number;
  averageGoals: number;
  winPercentage: number;
}

export interface GameResult {
  opponent: string;
  result: 'W' | 'D' | 'L';
  score: string;
  date: string;
  venue: 'home' | 'away';
}

export interface FormComparison {
  goalsScoredAdvantage: 'home' | 'away' | 'equal';
  goalsConcededAdvantage: 'home' | 'away' | 'equal';
  formAdvantage: 'home' | 'away' | 'equal';
  overallRating: number; // -5 to +5
}

export interface HeadToHeadAnalysis {
  totalMeetings: number;
  homeTeamWins: number;
  awayTeamWins: number;
  draws: number;
  lastMeeting?: GameResult;
  averageGoals: number;
  trends: string[];
}

export interface InjuryReport {
  playerId: string;
  playerName: string;
  position: string;
  importance: 'key' | 'regular' | 'squad';
  injuryType: string;
  expectedReturn?: string;
  impact: number; // 1-10 scale
}

export interface WeatherImpact {
  conditions: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  impact: 'positive' | 'negative' | 'neutral';
  reasoning: string;
}

export interface MotivationFactors {
  homeTeam: MotivationLevel;
  awayTeam: MotivationLevel;
  context: string[];
}

export interface MotivationLevel {
  level: 'very_high' | 'high' | 'normal' | 'low' | 'very_low';
  factors: string[];
  impact: number; // -3 to +3
}

export type PredictionSource =
  | 'ai_algorithm'
  | 'expert_tipster'
  | 'community'
  | 'statistical_model'
  | 'machine_learning'
  | 'hybrid';

export interface AlgorithmInfo {
  name: string;
  version: string;
  accuracy: number;
  confidence: number;
  dataPoints: number;
  lastUpdated: string;
  features: string[];
}

export interface PredictionResult {
  outcome: 'won' | 'lost' | 'void' | 'pushed';
  actualResult: string;
  profit?: number;
  roi?: number;
  settledAt: string;
  settledBy: 'automatic' | 'manual';
}

export interface PredictionMetadata {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  popularity: number; // How many users backed this prediction
  bookmakerCount: number; // How many bookmakers offer this market
  marketLiquidity: 'high' | 'medium' | 'low';
  variance: number; // Odds variance across bookmakers
  trending: boolean;
  featured: boolean;
  premium: boolean;
  categories: string[];
  region: string;
  language: string;
}

// Prediction collections and filtering
export interface PredictionFilter {
  sportId?: string;
  competitionId?: string;
  teamId?: string;
  type?: PredictionType;
  status?: PredictionStatus;
  source?: PredictionSource;
  minConfidence?: number;
  maxConfidence?: number;
  minOdds?: number;
  maxOdds?: number;
  dateFrom?: string;
  dateTo?: string;
  premium?: boolean;
  featured?: boolean;
  trending?: boolean;
  tags?: string[];
}

export interface PredictionSearchParams extends PredictionFilter {
  query?: string;
  sortBy?: 'confidence' | 'odds' | 'createdAt' | 'popularity' | 'roi';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PredictionSearchResponse {
  predictions: Prediction[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  stats: PredictionStats;
  filters: PredictionFilterOptions;
}

export interface PredictionStats {
  totalPredictions: number;
  winRate: number;
  averageOdds: number;
  averageConfidence: number;
  totalProfit: number;
  roi: number;
  bestStreak: number;
  currentStreak: number;
  byType: Record<PredictionType, TypeStats>;
  bySource: Record<PredictionSource, SourceStats>;
}

export interface TypeStats {
  count: number;
  winRate: number;
  averageOdds: number;
  profit: number;
  roi: number;
}

export interface SourceStats {
  count: number;
  winRate: number;
  averageConfidence: number;
  profit: number;
  roi: number;
}

export interface PredictionFilterOptions {
  sports: Array<{ id: string; name: string; count: number }>;
  competitions: Array<{ id: string; name: string; count: number }>;
  types: Array<{ type: PredictionType; count: number }>;
  sources: Array<{ source: PredictionSource; count: number }>;
  tags: Array<{ tag: string; count: number }>;
}

// Prediction creation and updates
export interface CreatePredictionRequest {
  matchId: string;
  type: PredictionType;
  market: PredictionMarket;
  outcome: PredictionOutcome;
  confidence: number;
  odds?: number;
  stake?: number;
  reasoning?: string;
  tags?: string[];
  source: PredictionSource;
  algorithm?: string;
}

export interface UpdatePredictionRequest {
  confidence?: number;
  odds?: number;
  stake?: number;
  reasoning?: string;
  tags?: string[];
  status?: PredictionStatus;
}

// Prediction tracking and portfolio
export interface PredictionPortfolio {
  userId: string;
  predictions: Prediction[];
  stats: PredictionStats;
  performance: PerformanceMetrics;
  bankroll: BankrollInfo;
  settings: PortfolioSettings;
}

export interface PerformanceMetrics {
  totalBets: number;
  wonBets: number;
  lostBets: number;
  voidBets: number;
  winRate: number;
  averageOdds: number;
  totalStaked: number;
  totalReturns: number;
  netProfit: number;
  roi: number;
  yield: number;
  longestWinStreak: number;
  longestLoseStreak: number;
  currentStreak: number;
  profitByMonth: MonthlyProfit[];
  profitByType: Record<PredictionType, number>;
}

export interface MonthlyProfit {
  month: string;
  profit: number;
  bets: number;
  winRate: number;
}

export interface BankrollInfo {
  initial: number;
  current: number;
  available: number;
  reserved: number;
  maxDrawdown: number;
  highWaterMark: number;
  riskPercentage: number;
}

export interface PortfolioSettings {
  defaultStake: number;
  maxStakePerBet: number;
  maxDailyStake: number;
  riskManagement: RiskManagementSettings;
  notifications: PredictionNotificationSettings;
  autoStaking: boolean;
  stakingStrategy: StakingStrategy;
}

export interface RiskManagementSettings {
  maxRiskPerBet: number; // Percentage of bankroll
  stopLossLimit: number;
  profitTarget: number;
  maxConsecutiveLosses: number;
  cooldownPeriod: number; // Hours
}

export interface PredictionNotificationSettings {
  newPredictions: boolean;
  resultUpdates: boolean;
  winStreaks: boolean;
  lossStreaks: boolean;
  profitTargets: boolean;
  riskAlerts: boolean;
}

export interface StakingStrategy {
  type: 'fixed' | 'percentage' | 'kelly' | 'fibonacci' | 'martingale';
  baseAmount: number;
  riskPercentage?: number;
  maxStake?: number;
  progressionFactor?: number;
}
