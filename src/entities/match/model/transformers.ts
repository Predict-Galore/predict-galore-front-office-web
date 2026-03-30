/**
 * MATCH ENTITY - API Transformers
 *
 * Utilities for transforming between API responses and Match entities
 */

import {
  Team,
  Sport,
  Competition,
  MatchEvent,
  MatchScore,
  MatchStatistics,
  MatchOdds,
  MatchPrediction,
  WeatherConditions,
  MatchCoverage,
  MatchMetadata,
  Country,
  Person,
  Referee,
  Venue,
  Season,
  CompetitionFormat,
  TeamColors,
  TeamForm,
  TeamStats,
  SportRules,
  OddsMarket,
  OddsOutcome,
  BroadcastInfo,
} from './types';

// API response interfaces (what we receive from backend)
export interface ApiMatchResponse {
  id: string;
  external_id?: string;
  sport: ApiSportResponse;
  competition: ApiCompetitionResponse;
  season?: ApiSeasonResponse;
  round?: string;
  home_team: ApiTeamResponse;
  away_team: ApiTeamResponse;
  venue?: ApiVenueResponse;
  referee?: ApiRefereeResponse;
  status: string;
  scheduled_at: string;
  started_at?: string;
  finished_at?: string;
  score: ApiMatchScoreResponse;
  statistics?: ApiMatchStatisticsResponse;
  events: ApiMatchEventResponse[];
  odds?: ApiMatchOddsResponse;
  predictions?: ApiMatchPredictionResponse[];
  weather?: ApiWeatherConditionsResponse;
  attendance?: number;
  coverage: ApiMatchCoverageResponse;
  metadata: ApiMatchMetadataResponse;
}

export interface ApiSportResponse {
  id: string;
  name: string;
  slug: string;
  category: string;
  is_popular: boolean;
  icon?: string;
  color?: string;
  rules?: ApiSportRulesResponse;
}

export interface ApiSportRulesResponse {
  duration: number;
  periods: number;
  players_per_team: number;
  substitutions: number;
  overtime?: boolean;
  penalties?: boolean;
}

export interface ApiCompetitionResponse {
  id: string;
  name: string;
  slug: string;
  short_name?: string;
  sport: ApiSportResponse;
  country?: ApiCountryResponse;
  level: string;
  type: string;
  season?: ApiSeasonResponse;
  logo?: string;
  is_popular: boolean;
  format: ApiCompetitionFormatResponse;
}

export interface ApiCompetitionFormatResponse {
  type: string;
  rounds?: number;
  groups?: number;
  teams_per_group?: number;
  promotion_spots?: number;
  relegation_spots?: number;
}

export interface ApiSeasonResponse {
  id: string;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface ApiTeamResponse {
  id: string;
  name: string;
  short_name: string;
  code: string;
  logo?: string;
  colors: ApiTeamColorsResponse;
  country?: ApiCountryResponse;
  founded?: number;
  venue?: ApiVenueResponse;
  manager?: ApiPersonResponse;
  is_national: boolean;
  form?: ApiTeamFormResponse;
  stats?: ApiTeamStatsResponse;
}

export interface ApiTeamColorsResponse {
  primary: string;
  secondary: string;
  accent?: string;
}

export interface ApiTeamFormResponse {
  recent: ('W' | 'D' | 'L')[];
  home_record: Record<string, number>;
  away_record: Record<string, number>;
  goals_for: number;
  goals_against: number;
  clean_sheets: number;
}

export interface ApiTeamStatsResponse {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  position?: number;
  form: string;
}

export interface ApiCountryResponse {
  id: string;
  name: string;
  code: string;
  flag?: string;
  continent: string;
}

export interface ApiPersonResponse {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  nationality?: ApiCountryResponse;
  date_of_birth?: string;
  photo?: string;
}

export interface ApiRefereeResponse extends ApiPersonResponse {
  experience: number;
  matches_officiated: number;
}

export interface ApiVenueResponse {
  id: string;
  name: string;
  city: string;
  country: ApiCountryResponse;
  capacity?: number;
  surface?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ApiMatchScoreResponse {
  home: number;
  away: number;
  halftime?: {
    home: number;
    away: number;
  };
  fulltime?: {
    home: number;
    away: number;
  };
  extratime?: {
    home: number;
    away: number;
  };
  penalties?: {
    home: number;
    away: number;
  };
}

export interface ApiMatchStatisticsResponse {
  possession: {
    home: number;
    away: number;
  };
  shots: {
    home: number;
    away: number;
  };
  shots_on_target: {
    home: number;
    away: number;
  };
  corners: {
    home: number;
    away: number;
  };
  fouls: {
    home: number;
    away: number;
  };
  yellow_cards: {
    home: number;
    away: number;
  };
  red_cards: {
    home: number;
    away: number;
  };
  offsides: {
    home: number;
    away: number;
  };
}

export interface ApiMatchEventResponse {
  id: string;
  type: string;
  minute: number;
  extra_time?: number;
  team: 'home' | 'away';
  player?: ApiPersonResponse;
  assist_player?: ApiPersonResponse;
  description: string;
  coordinates?: {
    x: number;
    y: number;
  };
}

export interface ApiMatchOddsResponse {
  bookmaker: string;
  markets: ApiOddsMarketResponse[];
  updated_at: string;
}

export interface ApiOddsMarketResponse {
  name: string;
  type: string;
  outcomes: ApiOddsOutcomeResponse[];
}

export interface ApiOddsOutcomeResponse {
  name: string;
  odds: number;
  probability?: number;
}

export interface ApiMatchPredictionResponse {
  id: string;
  type: string;
  outcome: string;
  confidence: number;
  odds?: number;
  reasoning?: string;
  accuracy?: number;
  created_at: string;
}

export interface ApiWeatherConditionsResponse {
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  conditions: string;
  visibility: number;
}

export interface ApiMatchCoverageResponse {
  live: boolean;
  video: boolean;
  audio: boolean;
  statistics: boolean;
  lineups: boolean;
  events: boolean;
}

export interface ApiMatchMetadataResponse {
  importance: number;
  rivalry?: boolean;
  derby?: boolean;
  cup_final?: boolean;
  playoff?: boolean;
  tags: string[];
  broadcast_info?: ApiBroadcastInfoResponse[];
}

export interface ApiBroadcastInfoResponse {
  country: string;
  broadcaster: string;
  type: string;
  language: string;
}
/**
 * Transform API country response to Country entity
 */
export function transformApiCountryToEntity(apiCountry: ApiCountryResponse): Country {
  return {
    id: apiCountry.id,
    name: apiCountry.name,
    code: apiCountry.code,
    flag: apiCountry.flag,
    continent: apiCountry.continent,
  };
}

/**
 * Transform API person response to Person entity
 */
export function transformApiPersonToEntity(apiPerson: ApiPersonResponse): Person {
  return {
    id: apiPerson.id,
    name: apiPerson.name,
    firstName: apiPerson.first_name,
    lastName: apiPerson.last_name,
    nationality: apiPerson.nationality
      ? transformApiCountryToEntity(apiPerson.nationality)
      : undefined,
    dateOfBirth: apiPerson.date_of_birth,
    photo: apiPerson.photo,
  };
}

/**
 * Transform API referee response to Referee entity
 */
export function transformApiRefereeToEntity(apiReferee: ApiRefereeResponse): Referee {
  return {
    ...transformApiPersonToEntity(apiReferee),
    experience: apiReferee.experience,
    matchesOfficiated: apiReferee.matches_officiated,
  };
}

/**
 * Transform API venue response to Venue entity
 */
export function transformApiVenueToEntity(apiVenue: ApiVenueResponse): Venue {
  return {
    id: apiVenue.id,
    name: apiVenue.name,
    city: apiVenue.city,
    country: transformApiCountryToEntity(apiVenue.country),
    capacity: apiVenue.capacity,
    surface: apiVenue.surface as Venue['surface'],
    coordinates: apiVenue.coordinates,
  };
}

/**
 * Transform API sport rules response to SportRules entity
 */
export function transformApiSportRulesToEntity(apiRules: ApiSportRulesResponse): SportRules {
  return {
    duration: apiRules.duration,
    periods: apiRules.periods,
    playersPerTeam: apiRules.players_per_team,
    substitutions: apiRules.substitutions,
    overtime: apiRules.overtime,
    penalties: apiRules.penalties,
  };
}

/**
 * Transform API sport response to Sport entity
 */
export function transformApiSportToEntity(apiSport: ApiSportResponse): Sport {
  return {
    id: apiSport.id,
    name: apiSport.name,
    slug: apiSport.slug,
    category: apiSport.category,
    isPopular: apiSport.is_popular,
    icon: apiSport.icon,
    color: apiSport.color,
    rules: apiSport.rules ? transformApiSportRulesToEntity(apiSport.rules) : undefined,
  };
}

/**
 * Transform API season response to Season entity
 */
export function transformApiSeasonToEntity(apiSeason: ApiSeasonResponse): Season {
  return {
    id: apiSeason.id,
    name: apiSeason.name,
    year: apiSeason.year,
    startDate: apiSeason.start_date,
    endDate: apiSeason.end_date,
    isCurrent: apiSeason.is_current,
  };
}

/**
 * Transform API competition format response to CompetitionFormat entity
 */
export function transformApiCompetitionFormatToEntity(
  apiFormat: ApiCompetitionFormatResponse
): CompetitionFormat {
  return {
    type: apiFormat.type as CompetitionFormat['type'],
    rounds: apiFormat.rounds,
    groups: apiFormat.groups,
    teamsPerGroup: apiFormat.teams_per_group,
    promotionSpots: apiFormat.promotion_spots,
    relegationSpots: apiFormat.relegation_spots,
  };
}

/**
 * Transform API competition response to Competition entity
 */
export function transformApiCompetitionToEntity(
  apiCompetition: ApiCompetitionResponse
): Competition {
  return {
    id: apiCompetition.id,
    name: apiCompetition.name,
    slug: apiCompetition.slug,
    shortName: apiCompetition.short_name,
    sport: transformApiSportToEntity(apiCompetition.sport),
    country: apiCompetition.country
      ? transformApiCountryToEntity(apiCompetition.country)
      : undefined,
    level: apiCompetition.level as Competition['level'],
    type: apiCompetition.type as Competition['type'],
    season: apiCompetition.season ? transformApiSeasonToEntity(apiCompetition.season) : undefined,
    logo: apiCompetition.logo,
    isPopular: apiCompetition.is_popular,
    format: transformApiCompetitionFormatToEntity(apiCompetition.format),
  };
}

/**
 * Transform API team colors response to TeamColors entity
 */
export function transformApiTeamColorsToEntity(apiColors: ApiTeamColorsResponse): TeamColors {
  return {
    primary: apiColors.primary,
    secondary: apiColors.secondary,
    accent: apiColors.accent,
  };
}

/**
 * Transform API team form response to TeamForm entity
 */
export function transformApiTeamFormToEntity(apiForm: ApiTeamFormResponse): TeamForm {
  return {
    recent: apiForm.recent,
    homeRecord: apiForm.home_record,
    awayRecord: apiForm.away_record,
    goalsFor: apiForm.goals_for,
    goalsAgainst: apiForm.goals_against,
    cleanSheets: apiForm.clean_sheets,
  };
}

/**
 * Transform API team stats response to TeamStats entity
 */
export function transformApiTeamStatsToEntity(apiStats: ApiTeamStatsResponse): TeamStats {
  return {
    played: apiStats.played,
    wins: apiStats.wins,
    draws: apiStats.draws,
    losses: apiStats.losses,
    goalsFor: apiStats.goals_for,
    goalsAgainst: apiStats.goals_against,
    goalDifference: apiStats.goal_difference,
    points: apiStats.points,
    position: apiStats.position,
    form: apiStats.form,
  };
}

/**
 * Transform API team response to Team entity
 */
export function transformApiTeamToEntity(apiTeam: ApiTeamResponse): Team {
  return {
    id: apiTeam.id,
    name: apiTeam.name,
    shortName: apiTeam.short_name,
    code: apiTeam.code,
    logo: apiTeam.logo,
    colors: transformApiTeamColorsToEntity(apiTeam.colors),
    country: apiTeam.country ? transformApiCountryToEntity(apiTeam.country) : undefined,
    founded: apiTeam.founded,
    venue: apiTeam.venue ? transformApiVenueToEntity(apiTeam.venue) : undefined,
    manager: apiTeam.manager ? transformApiPersonToEntity(apiTeam.manager) : undefined,
    isNational: apiTeam.is_national,
    form: apiTeam.form ? transformApiTeamFormToEntity(apiTeam.form) : undefined,
    stats: apiTeam.stats ? transformApiTeamStatsToEntity(apiTeam.stats) : undefined,
  };
}

/**
 * Transform API match score response to MatchScore entity
 */
export function transformApiMatchScoreToEntity(apiScore: ApiMatchScoreResponse): MatchScore {
  return {
    home: apiScore.home,
    away: apiScore.away,
    halftime: apiScore.halftime,
    fulltime: apiScore.fulltime,
    extratime: apiScore.extratime,
    penalties: apiScore.penalties,
  };
}

/**
 * Transform API match statistics response to MatchStatistics entity
 */
export function transformApiMatchStatisticsToEntity(
  apiStats: ApiMatchStatisticsResponse
): MatchStatistics {
  return {
    possession: apiStats.possession,
    shots: apiStats.shots,
    shotsOnTarget: apiStats.shots_on_target,
    corners: apiStats.corners,
    fouls: apiStats.fouls,
    yellowCards: apiStats.yellow_cards,
    redCards: apiStats.red_cards,
    offsides: apiStats.offsides,
  };
}

/**
 * Transform API match event response to MatchEvent entity
 */
export function transformApiMatchEventToEntity(apiEvent: ApiMatchEventResponse): MatchEvent {
  return {
    id: apiEvent.id,
    type: apiEvent.type as MatchEvent['type'],
    minute: apiEvent.minute,
    extraTime: apiEvent.extra_time,
    team: apiEvent.team,
    player: apiEvent.player ? transformApiPersonToEntity(apiEvent.player) : undefined,
    assistPlayer: apiEvent.assist_player
      ? transformApiPersonToEntity(apiEvent.assist_player)
      : undefined,
    description: apiEvent.description,
    coordinates: apiEvent.coordinates,
  };
}

/**
 * Transform API odds outcome response to OddsOutcome entity
 */
export function transformApiOddsOutcomeToEntity(apiOutcome: ApiOddsOutcomeResponse): OddsOutcome {
  return {
    name: apiOutcome.name,
    odds: apiOutcome.odds,
    probability: apiOutcome.probability,
  };
}

/**
 * Transform API odds market response to OddsMarket entity
 */
export function transformApiOddsMarketToEntity(apiMarket: ApiOddsMarketResponse): OddsMarket {
  return {
    name: apiMarket.name,
    type: apiMarket.type as OddsMarket['type'],
    outcomes: apiMarket.outcomes.map(transformApiOddsOutcomeToEntity),
  };
}

/**
 * Transform API match odds response to MatchOdds entity
 */
export function transformApiMatchOddsToEntity(apiOdds: ApiMatchOddsResponse): MatchOdds {
  return {
    bookmaker: apiOdds.bookmaker,
    markets: apiOdds.markets.map(transformApiOddsMarketToEntity),
    updatedAt: apiOdds.updated_at,
  };
}

/**
 * Transform API match prediction response to MatchPrediction entity
 */
export function transformApiMatchPredictionToEntity(
  apiPrediction: ApiMatchPredictionResponse
): MatchPrediction {
  return {
    id: apiPrediction.id,
    type: apiPrediction.type as MatchPrediction['type'],
    outcome: apiPrediction.outcome,
    confidence: apiPrediction.confidence,
    odds: apiPrediction.odds,
    reasoning: apiPrediction.reasoning,
    accuracy: apiPrediction.accuracy,
    createdAt: apiPrediction.created_at,
  };
}

/**
 * Transform API weather conditions response to WeatherConditions entity
 */
export function transformApiWeatherConditionsToEntity(
  apiWeather: ApiWeatherConditionsResponse
): WeatherConditions {
  return {
    temperature: apiWeather.temperature,
    humidity: apiWeather.humidity,
    windSpeed: apiWeather.wind_speed,
    windDirection: apiWeather.wind_direction,
    conditions: apiWeather.conditions,
    visibility: apiWeather.visibility,
  };
}

/**
 * Transform API match coverage response to MatchCoverage entity
 */
export function transformApiMatchCoverageToEntity(
  apiCoverage: ApiMatchCoverageResponse
): MatchCoverage {
  return {
    live: apiCoverage.live,
    video: apiCoverage.video,
    audio: apiCoverage.audio,
    statistics: apiCoverage.statistics,
    lineups: apiCoverage.lineups,
    events: apiCoverage.events,
  };
}

/**
 * Transform API broadcast info response to BroadcastInfo entity
 */
export function transformApiBroadcastInfoToEntity(
  apiBroadcast: ApiBroadcastInfoResponse
): BroadcastInfo {
  return {
    country: apiBroadcast.country,
    broadcaster: apiBroadcast.broadcaster,
    type: apiBroadcast.type as BroadcastInfo['type'],
    language: apiBroadcast.language,
  };
}

/**
 * Transform API match metadata response to MatchMetadata entity
 */
export function transformApiMatchMetadataToEntity(
  apiMetadata: ApiMatchMetadataResponse
): MatchMetadata {
  return {
    importance: apiMetadata.importance,
    rivalry: apiMetadata.rivalry,
    derby: apiMetadata.derby,
    cupFinal: apiMetadata.cup_final,
    playoff: apiMetadata.playoff,
    tags: apiMetadata.tags,
    broadcastInfo: apiMetadata.broadcast_info?.map(transformApiBroadcastInfoToEntity),
  };
}
/**
 * Transform API match response to Match entity
 */
