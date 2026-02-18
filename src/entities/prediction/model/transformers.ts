/**
 * PREDICTION ENTITY - API Transformers
 * 
 * Utilities for transforming between API responses and Prediction entities
 */

import {
  Prediction,
  CreatePredictionRequest,
  UpdatePredictionRequest,
  PredictionSearchResponse,
  PredictionAnalysis,
  PredictionResult,
  PredictionMetadata,
  MatchInfo,
  TeamInfo,
  PredictionMarket,
  PredictionOutcome,
  AlgorithmInfo,
  HistoricalData,
  TeamFormAnalysis,
  HeadToHeadAnalysis,
  InjuryReport,
  WeatherImpact,
  MotivationFactors,
  FormData,
  FormComparison,
  GameResult,
  MotivationLevel,
  MarketOption,
  PredictionType,
  PredictionSource,
  TypeStats,
  SourceStats,
} from './types';
import { 
  predictionSchema, 
  createPredictionRequestSchema, 
  updatePredictionRequestSchema,
  predictionSearchResponseSchema
} from './schemas';

interface ApiPredictionStats {
  total_predictions: number;
  win_rate: number;
  average_odds: number;
  average_confidence: number;
  total_profit: number;
  roi: number;
  best_streak: number;
  current_streak: number;
  by_type: Record<PredictionType, TypeStats>;
  by_source: Record<PredictionSource, SourceStats>;
}

interface ApiPredictionFilters {
  sports: Array<{ id: string; name: string; count: number }>;
  competitions: Array<{ id: string; name: string; count: number }>;
  types: Array<{ type: PredictionType; count: number }>;
  sources: Array<{ source: PredictionSource; count: number }>;
  tags: Array<{ tag: string; count: number }>;
}

// API response interfaces (what we receive from backend)
export interface ApiPredictionResponse {
  id: string;
  match_id: string;
  match: ApiMatchInfoResponse;
  type: string;
  market: ApiPredictionMarketResponse;
  outcome: ApiPredictionOutcomeResponse;
  confidence: number;
  odds?: number;
  probability?: number;
  stake?: number;
  potential_return?: number;
  status: string;
  reasoning?: string;
  analysis?: ApiPredictionAnalysisResponse;
  tags: string[];
  source: string;
  algorithm?: ApiAlgorithmInfoResponse;
  created_at: string;
  updated_at: string;
  settled_at?: string;
  result?: ApiPredictionResultResponse;
  metadata: ApiPredictionMetadataResponse;
}

export interface ApiMatchInfoResponse {
  id: string;
  home_team: ApiTeamInfoResponse;
  away_team: ApiTeamInfoResponse;
  competition: string;
  scheduled_at: string;
  status: string;
  venue?: string;
}

export interface ApiTeamInfoResponse {
  id: string;
  name: string;
  short_name: string;
  logo?: string;
  form?: string;
  position?: number;
}

export interface ApiMarketOptionResponse {
  id: string;
  name: string;
  value: string;
  odds?: number;
  probability?: number;
}

export interface ApiPredictionMarketResponse {
  name: string;
  type: string;
  description: string;
  options: ApiMarketOptionResponse[];
  handicap?: number;
  total?: number;
  period?: string;
}

export interface ApiPredictionOutcomeResponse {
  selection: string;
  value: string | number;
  display: string;
  odds?: number;
  probability?: number;
}

export interface ApiGameResultResponse {
  opponent: string;
  result: 'W' | 'D' | 'L';
  score: string;
  date: string;
  venue: 'home' | 'away';
}

export interface ApiFormDataResponse {
  last_5_games: ApiGameResultResponse[];
  goals_for: number;
  goals_against: number;
  clean_sheets: number;
  btts: number;
  average_goals: number;
  win_percentage: number;
}

export interface ApiFormComparisonResponse {
  goals_scored_advantage: 'home' | 'away' | 'equal';
  goals_conceded_advantage: 'home' | 'away' | 'equal';
  form_advantage: 'home' | 'away' | 'equal';
  overall_rating: number;
}

export interface ApiTeamFormAnalysisResponse {
  home: ApiFormDataResponse;
  away: ApiFormDataResponse;
  comparison: ApiFormComparisonResponse;
}

export interface ApiHistoricalDataResponse {
  total_matches: number;
  home_wins: number;
  away_wins: number;
  draws: number;
  average_goals: number;
  btts_percentage: number;
  over_25_percentage: number;
  clean_sheet_percentage: number;
}

export interface ApiHeadToHeadAnalysisResponse {
  total_meetings: number;
  home_team_wins: number;
  away_team_wins: number;
  draws: number;
  last_meeting?: ApiGameResultResponse;
  average_goals: number;
  trends: string[];
}

export interface ApiInjuryReportResponse {
  player_id: string;
  player_name: string;
  position: string;
  importance: 'key' | 'regular' | 'squad';
  injury_type: string;
  expected_return?: string;
  impact: number;
}

export interface ApiWeatherImpactResponse {
  conditions: string;
  temperature: number;
  wind_speed: number;
  precipitation: number;
  impact: 'positive' | 'negative' | 'neutral';
  reasoning: string;
}

export interface ApiMotivationLevelResponse {
  level: string;
  factors: string[];
  impact: number;
}

export interface ApiMotivationFactorsResponse {
  home_team: ApiMotivationLevelResponse;
  away_team: ApiMotivationLevelResponse;
  context: string[];
}

export interface ApiPredictionAnalysisResponse {
  key_factors: string[];
  strengths: string[];
  risks: string[];
  historical_data?: ApiHistoricalDataResponse;
  team_form?: ApiTeamFormAnalysisResponse;
  head_to_head?: ApiHeadToHeadAnalysisResponse;
  injuries?: ApiInjuryReportResponse[];
  weather?: ApiWeatherImpactResponse;
  motivation?: ApiMotivationFactorsResponse;
}

export interface ApiAlgorithmInfoResponse {
  name: string;
  version: string;
  accuracy: number;
  confidence: number;
  data_points: number;
  last_updated: string;
  features: string[];
}

export interface ApiPredictionResultResponse {
  outcome: 'won' | 'lost' | 'void' | 'pushed';
  actual_result: string;
  profit?: number;
  roi?: number;
  settled_at: string;
  settled_by: 'automatic' | 'manual';
}

export interface ApiPredictionMetadataResponse {
  difficulty: string;
  popularity: number;
  bookmaker_count: number;
  market_liquidity: string;
  variance: number;
  trending: boolean;
  featured: boolean;
  premium: boolean;
  categories: string[];
  region: string;
  language: string;
}

export interface ApiCreatePredictionRequest {
  match_id: string;
  type: string;
  market: ApiPredictionMarketResponse;
  outcome: ApiPredictionOutcomeResponse;
  confidence: number;
  odds?: number;
  stake?: number;
  reasoning?: string;
  tags?: string[];
  source: string;
  algorithm?: string;
}

export interface ApiUpdatePredictionRequest {
  confidence?: number;
  odds?: number;
  stake?: number;
  reasoning?: string;
  tags?: string[];
  status?: string;
}

/**
 * Transform API team info response to TeamInfo entity
 */
export function transformApiTeamInfoToEntity(apiTeamInfo: ApiTeamInfoResponse): TeamInfo {
  return {
    id: apiTeamInfo.id,
    name: apiTeamInfo.name,
    shortName: apiTeamInfo.short_name,
    logo: apiTeamInfo.logo,
    form: apiTeamInfo.form,
    position: apiTeamInfo.position,
  };
}

/**
 * Transform API match info response to MatchInfo entity
 */
export function transformApiMatchInfoToEntity(apiMatchInfo: ApiMatchInfoResponse): MatchInfo {
  return {
    id: apiMatchInfo.id,
    homeTeam: transformApiTeamInfoToEntity(apiMatchInfo.home_team),
    awayTeam: transformApiTeamInfoToEntity(apiMatchInfo.away_team),
    competition: apiMatchInfo.competition,
    scheduledAt: apiMatchInfo.scheduled_at,
    status: apiMatchInfo.status,
    venue: apiMatchInfo.venue,
  };
}

/**
 * Transform API market option response to MarketOption entity
 */
export function transformApiMarketOptionToEntity(apiOption: ApiMarketOptionResponse): MarketOption {
  return {
    id: apiOption.id,
    name: apiOption.name,
    value: apiOption.value,
    odds: apiOption.odds,
    probability: apiOption.probability,
  };
}

/**
 * Transform API prediction market response to PredictionMarket entity
 */
export function transformApiPredictionMarketToEntity(apiMarket: ApiPredictionMarketResponse): PredictionMarket {
  return {
    name: apiMarket.name,
    type: apiMarket.type as PredictionMarket['type'],
    description: apiMarket.description,
    options: apiMarket.options.map(transformApiMarketOptionToEntity),
    handicap: apiMarket.handicap,
    total: apiMarket.total,
    period: apiMarket.period as PredictionMarket['period'],
  };
}

/**
 * Transform API prediction outcome response to PredictionOutcome entity
 */
export function transformApiPredictionOutcomeToEntity(apiOutcome: ApiPredictionOutcomeResponse): PredictionOutcome {
  return {
    selection: apiOutcome.selection,
    value: apiOutcome.value,
    display: apiOutcome.display,
    odds: apiOutcome.odds,
    probability: apiOutcome.probability,
  };
}

/**
 * Transform API game result response to GameResult entity
 */
export function transformApiGameResultToEntity(apiGameResult: ApiGameResultResponse): GameResult {
  return {
    opponent: apiGameResult.opponent,
    result: apiGameResult.result,
    score: apiGameResult.score,
    date: apiGameResult.date,
    venue: apiGameResult.venue,
  };
}

/**
 * Transform API form data response to FormData entity
 */
export function transformApiFormDataToEntity(apiFormData: ApiFormDataResponse): FormData {
  return {
    last5Games: apiFormData.last_5_games.map(transformApiGameResultToEntity),
    goalsFor: apiFormData.goals_for,
    goalsAgainst: apiFormData.goals_against,
    cleanSheets: apiFormData.clean_sheets,
    btts: apiFormData.btts,
    averageGoals: apiFormData.average_goals,
    winPercentage: apiFormData.win_percentage,
  };
}

/**
 * Transform API form comparison response to FormComparison entity
 */
export function transformApiFormComparisonToEntity(apiComparison: ApiFormComparisonResponse): FormComparison {
  return {
    goalsScoredAdvantage: apiComparison.goals_scored_advantage,
    goalsConcededAdvantage: apiComparison.goals_conceded_advantage,
    formAdvantage: apiComparison.form_advantage,
    overallRating: apiComparison.overall_rating,
  };
}

/**
 * Transform API team form analysis response to TeamFormAnalysis entity
 */
export function transformApiTeamFormAnalysisToEntity(apiTeamForm: ApiTeamFormAnalysisResponse): TeamFormAnalysis {
  return {
    home: transformApiFormDataToEntity(apiTeamForm.home),
    away: transformApiFormDataToEntity(apiTeamForm.away),
    comparison: transformApiFormComparisonToEntity(apiTeamForm.comparison),
  };
}

/**
 * Transform API historical data response to HistoricalData entity
 */
export function transformApiHistoricalDataToEntity(apiHistorical: ApiHistoricalDataResponse): HistoricalData {
  return {
    totalMatches: apiHistorical.total_matches,
    homeWins: apiHistorical.home_wins,
    awayWins: apiHistorical.away_wins,
    draws: apiHistorical.draws,
    averageGoals: apiHistorical.average_goals,
    bttsPercentage: apiHistorical.btts_percentage,
    over25Percentage: apiHistorical.over_25_percentage,
    cleanSheetPercentage: apiHistorical.clean_sheet_percentage,
  };
}

/**
 * Transform API head to head analysis response to HeadToHeadAnalysis entity
 */
export function transformApiHeadToHeadAnalysisToEntity(apiH2H: ApiHeadToHeadAnalysisResponse): HeadToHeadAnalysis {
  return {
    totalMeetings: apiH2H.total_meetings,
    homeTeamWins: apiH2H.home_team_wins,
    awayTeamWins: apiH2H.away_team_wins,
    draws: apiH2H.draws,
    lastMeeting: apiH2H.last_meeting ? transformApiGameResultToEntity(apiH2H.last_meeting) : undefined,
    averageGoals: apiH2H.average_goals,
    trends: apiH2H.trends,
  };
}

/**
 * Transform API injury report response to InjuryReport entity
 */
export function transformApiInjuryReportToEntity(apiInjury: ApiInjuryReportResponse): InjuryReport {
  return {
    playerId: apiInjury.player_id,
    playerName: apiInjury.player_name,
    position: apiInjury.position,
    importance: apiInjury.importance,
    injuryType: apiInjury.injury_type,
    expectedReturn: apiInjury.expected_return,
    impact: apiInjury.impact,
  };
}

/**
 * Transform API weather impact response to WeatherImpact entity
 */
export function transformApiWeatherImpactToEntity(apiWeather: ApiWeatherImpactResponse): WeatherImpact {
  return {
    conditions: apiWeather.conditions,
    temperature: apiWeather.temperature,
    windSpeed: apiWeather.wind_speed,
    precipitation: apiWeather.precipitation,
    impact: apiWeather.impact,
    reasoning: apiWeather.reasoning,
  };
}

/**
 * Transform API motivation level response to MotivationLevel entity
 */
export function transformApiMotivationLevelToEntity(apiMotivation: ApiMotivationLevelResponse): MotivationLevel {
  return {
    level: apiMotivation.level as MotivationLevel['level'],
    factors: apiMotivation.factors,
    impact: apiMotivation.impact,
  };
}

/**
 * Transform API motivation factors response to MotivationFactors entity
 */
export function transformApiMotivationFactorsToEntity(apiMotivationFactors: ApiMotivationFactorsResponse): MotivationFactors {
  return {
    homeTeam: transformApiMotivationLevelToEntity(apiMotivationFactors.home_team),
    awayTeam: transformApiMotivationLevelToEntity(apiMotivationFactors.away_team),
    context: apiMotivationFactors.context,
  };
}

/**
 * Transform API prediction analysis response to PredictionAnalysis entity
 */
export function transformApiPredictionAnalysisToEntity(apiAnalysis: ApiPredictionAnalysisResponse): PredictionAnalysis {
  return {
    keyFactors: apiAnalysis.key_factors,
    strengths: apiAnalysis.strengths,
    risks: apiAnalysis.risks,
    historicalData: apiAnalysis.historical_data ? transformApiHistoricalDataToEntity(apiAnalysis.historical_data) : undefined,
    teamForm: apiAnalysis.team_form ? transformApiTeamFormAnalysisToEntity(apiAnalysis.team_form) : undefined,
    headToHead: apiAnalysis.head_to_head ? transformApiHeadToHeadAnalysisToEntity(apiAnalysis.head_to_head) : undefined,
    injuries: apiAnalysis.injuries?.map(transformApiInjuryReportToEntity),
    weather: apiAnalysis.weather ? transformApiWeatherImpactToEntity(apiAnalysis.weather) : undefined,
    motivation: apiAnalysis.motivation ? transformApiMotivationFactorsToEntity(apiAnalysis.motivation) : undefined,
  };
}

/**
 * Transform API algorithm info response to AlgorithmInfo entity
 */
export function transformApiAlgorithmInfoToEntity(apiAlgorithm: ApiAlgorithmInfoResponse): AlgorithmInfo {
  return {
    name: apiAlgorithm.name,
    version: apiAlgorithm.version,
    accuracy: apiAlgorithm.accuracy,
    confidence: apiAlgorithm.confidence,
    dataPoints: apiAlgorithm.data_points,
    lastUpdated: apiAlgorithm.last_updated,
    features: apiAlgorithm.features,
  };
}

/**
 * Transform API prediction result response to PredictionResult entity
 */
export function transformApiPredictionResultToEntity(apiResult: ApiPredictionResultResponse): PredictionResult {
  return {
    outcome: apiResult.outcome,
    actualResult: apiResult.actual_result,
    profit: apiResult.profit,
    roi: apiResult.roi,
    settledAt: apiResult.settled_at,
    settledBy: apiResult.settled_by,
  };
}

/**
 * Transform API prediction metadata response to PredictionMetadata entity
 */
export function transformApiPredictionMetadataToEntity(apiMetadata: ApiPredictionMetadataResponse): PredictionMetadata {
  return {
    difficulty: apiMetadata.difficulty as PredictionMetadata['difficulty'],
    popularity: apiMetadata.popularity,
    bookmakerCount: apiMetadata.bookmaker_count,
    marketLiquidity: apiMetadata.market_liquidity as PredictionMetadata['marketLiquidity'],
    variance: apiMetadata.variance,
    trending: apiMetadata.trending,
    featured: apiMetadata.featured,
    premium: apiMetadata.premium,
    categories: apiMetadata.categories,
    region: apiMetadata.region,
    language: apiMetadata.language,
  };
}

/**
 * Transform API prediction response to Prediction entity with validation
 */
export function transformApiPredictionToEntity(apiPrediction: ApiPredictionResponse): Prediction {
  const transformedPrediction: Prediction = {
    id: apiPrediction.id,
    matchId: apiPrediction.match_id,
    match: transformApiMatchInfoToEntity(apiPrediction.match),
    type: apiPrediction.type as Prediction['type'],
    market: transformApiPredictionMarketToEntity(apiPrediction.market),
    outcome: transformApiPredictionOutcomeToEntity(apiPrediction.outcome),
    confidence: apiPrediction.confidence,
    odds: apiPrediction.odds,
    probability: apiPrediction.probability,
    stake: apiPrediction.stake,
    potentialReturn: apiPrediction.potential_return,
    status: apiPrediction.status as Prediction['status'],
    reasoning: apiPrediction.reasoning,
    analysis: apiPrediction.analysis ? transformApiPredictionAnalysisToEntity(apiPrediction.analysis) : undefined,
    tags: apiPrediction.tags,
    source: apiPrediction.source as Prediction['source'],
    algorithm: apiPrediction.algorithm ? transformApiAlgorithmInfoToEntity(apiPrediction.algorithm) : undefined,
    createdAt: apiPrediction.created_at,
    updatedAt: apiPrediction.updated_at,
    settledAt: apiPrediction.settled_at,
    result: apiPrediction.result ? transformApiPredictionResultToEntity(apiPrediction.result) : undefined,
    metadata: transformApiPredictionMetadataToEntity(apiPrediction.metadata),
  };

  // Validate the transformed prediction
  const validationResult = predictionSchema.safeParse(transformedPrediction);
  if (!validationResult.success) {
    throw new Error(`Invalid prediction data: ${validationResult.error.message}`);
  }

  return validationResult.data;
}

/**
 * Transform CreatePredictionRequest to API format
 */
export function transformCreatePredictionRequestToApi(request: CreatePredictionRequest): ApiCreatePredictionRequest {
  // Validate the request first
  const validationResult = createPredictionRequestSchema.safeParse(request);
  if (!validationResult.success) {
    throw new Error(`Invalid create prediction request: ${validationResult.error.message}`);
  }

  return {
    match_id: request.matchId,
    type: request.type,
    market: {
      name: request.market.name,
      type: request.market.type,
      description: request.market.description,
      options: request.market.options.map(option => ({
        id: option.id,
        name: option.name,
        value: option.value,
        odds: option.odds,
        probability: option.probability,
      })),
      handicap: request.market.handicap,
      total: request.market.total,
      period: request.market.period,
    },
    outcome: {
      selection: request.outcome.selection,
      value: request.outcome.value,
      display: request.outcome.display,
      odds: request.outcome.odds,
      probability: request.outcome.probability,
    },
    confidence: request.confidence,
    odds: request.odds,
    stake: request.stake,
    reasoning: request.reasoning,
    tags: request.tags,
    source: request.source,
    algorithm: request.algorithm,
  };
}

/**
 * Transform UpdatePredictionRequest to API format
 */
export function transformUpdatePredictionRequestToApi(request: UpdatePredictionRequest): ApiUpdatePredictionRequest {
  // Validate the request first
  const validationResult = updatePredictionRequestSchema.safeParse(request);
  if (!validationResult.success) {
    throw new Error(`Invalid update prediction request: ${validationResult.error.message}`);
  }

  return {
    confidence: request.confidence,
    odds: request.odds,
    stake: request.stake,
    reasoning: request.reasoning,
    tags: request.tags,
    status: request.status,
  };
}

/**
 * Transform array of API predictions to PredictionSearchResponse
 */
export function transformApiPredictionsToSearchResponse(
  apiPredictions: ApiPredictionResponse[],
  total: number,
  page: number,
  limit: number,
  stats: ApiPredictionStats,
  filters: ApiPredictionFilters
): PredictionSearchResponse {
  const predictions = apiPredictions.map(transformApiPredictionToEntity);

  const response: PredictionSearchResponse = {
    predictions,
    total,
    page,
    limit,
    hasMore: page * limit < total,
    stats: {
      totalPredictions: stats.total_predictions,
      winRate: stats.win_rate,
      averageOdds: stats.average_odds,
      averageConfidence: stats.average_confidence,
      totalProfit: stats.total_profit,
      roi: stats.roi,
      bestStreak: stats.best_streak,
      currentStreak: stats.current_streak,
      byType: stats.by_type,
      bySource: stats.by_source,
    },
    filters: {
      sports: filters.sports.map((sport) => ({
        id: sport.id,
        name: sport.name,
        count: sport.count,
      })),
      competitions: filters.competitions.map((comp) => ({
        id: comp.id,
        name: comp.name,
        count: comp.count,
      })),
      types: filters.types.map((type) => ({
        type: type.type,
        count: type.count,
      })),
      sources: filters.sources.map((source) => ({
        source: source.source,
        count: source.count,
      })),
      tags: filters.tags.map((tag) => ({
        tag: tag.tag,
        count: tag.count,
      })),
    },
  };

  // Validate the search response
  const validationResult = predictionSearchResponseSchema.safeParse(response);
  if (!validationResult.success) {
    throw new Error(`Invalid prediction search response: ${validationResult.error.message}`);
  }

  return validationResult.data;
}

/**
 * Batch transform multiple API predictions to Prediction entities
 */
export function transformApiPredictionsToEntities(apiPredictions: ApiPredictionResponse[]): Prediction[] {
  return apiPredictions.map(transformApiPredictionToEntity);
}

/**
 * Transform Prediction entity back to API format for updates
 */
export function transformPredictionEntityToApi(prediction: Prediction): ApiPredictionResponse {
  return {
    id: prediction.id,
    match_id: prediction.matchId,
    match: {
      id: prediction.match.id,
      home_team: {
        id: prediction.match.homeTeam.id,
        name: prediction.match.homeTeam.name,
        short_name: prediction.match.homeTeam.shortName,
        logo: prediction.match.homeTeam.logo,
        form: prediction.match.homeTeam.form,
        position: prediction.match.homeTeam.position,
      },
      away_team: {
        id: prediction.match.awayTeam.id,
        name: prediction.match.awayTeam.name,
        short_name: prediction.match.awayTeam.shortName,
        logo: prediction.match.awayTeam.logo,
        form: prediction.match.awayTeam.form,
        position: prediction.match.awayTeam.position,
      },
      competition: prediction.match.competition,
      scheduled_at: prediction.match.scheduledAt,
      status: prediction.match.status,
      venue: prediction.match.venue,
    },
    type: prediction.type,
    market: {
      name: prediction.market.name,
      type: prediction.market.type,
      description: prediction.market.description,
      options: prediction.market.options.map(option => ({
        id: option.id,
        name: option.name,
        value: option.value,
        odds: option.odds,
        probability: option.probability,
      })),
      handicap: prediction.market.handicap,
      total: prediction.market.total,
      period: prediction.market.period,
    },
    outcome: {
      selection: prediction.outcome.selection,
      value: prediction.outcome.value,
      display: prediction.outcome.display,
      odds: prediction.outcome.odds,
      probability: prediction.outcome.probability,
    },
    confidence: prediction.confidence,
    odds: prediction.odds,
    probability: prediction.probability,
    stake: prediction.stake,
    potential_return: prediction.potentialReturn,
    status: prediction.status,
    reasoning: prediction.reasoning,
    tags: prediction.tags,
    source: prediction.source,
    created_at: prediction.createdAt,
    updated_at: prediction.updatedAt,
    settled_at: prediction.settledAt,
    metadata: {
      difficulty: prediction.metadata.difficulty,
      popularity: prediction.metadata.popularity,
      bookmaker_count: prediction.metadata.bookmakerCount,
      market_liquidity: prediction.metadata.marketLiquidity,
      variance: prediction.metadata.variance,
      trending: prediction.metadata.trending,
      featured: prediction.metadata.featured,
      premium: prediction.metadata.premium,
      categories: prediction.metadata.categories,
      region: prediction.metadata.region,
      language: prediction.metadata.language,
    },
  };
}
