/**
 * MATCH ENTITY - Utility Functions
 *
 * Common utility functions for Match entity operations
 */

import {
  Match,
  Team,
  MatchEvent,
  WeatherConditions,
  MatchMetadata,
  MatchStatus,
  TeamForm,
  TeamStats,
} from './types';

/**
 * Check if match is currently live
 */
export function isMatchLive(match: Match): boolean {
  return match.status === 'live' || match.status === 'halftime';
}

/**
 * Check if match is finished
 */
export function isMatchFinished(match: Match): boolean {
  return match.status === 'finished';
}

/**
 * Check if match is scheduled (not started yet)
 */
export function isMatchScheduled(match: Match): boolean {
  return match.status === 'scheduled';
}

/**
 * Check if match is postponed or cancelled
 */
export function isMatchCancelled(match: Match): boolean {
  return match.status === 'postponed' || match.status === 'cancelled';
}

/**
 * Get match duration in minutes
 */
export function getMatchDuration(match: Match): number {
  if (!match.startedAt || !match.finishedAt) {
    return 0;
  }

  const start = new Date(match.startedAt);
  const end = new Date(match.finishedAt);
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * Get current match minute (for live matches)
 */
export function getCurrentMatchMinute(match: Match): number {
  if (!isMatchLive(match) || !match.startedAt) {
    return 0;
  }

  const start = new Date(match.startedAt);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * Get match result (Home Win, Away Win, Draw)
 */
export function getMatchResult(match: Match): 'home_win' | 'away_win' | 'draw' | 'pending' {
  if (!isMatchFinished(match)) {
    return 'pending';
  }

  const { home, away } = match.score;

  if (home > away) return 'home_win';
  if (away > home) return 'away_win';
  return 'draw';
}

/**
 * Get match winner team
 */
export function getMatchWinner(match: Match): Team | null {
  const result = getMatchResult(match);

  if (result === 'home_win') return match.homeTeam;
  if (result === 'away_win') return match.awayTeam;
  return null;
}

/**
 * Get match loser team
 */
export function getMatchLoser(match: Match): Team | null {
  const result = getMatchResult(match);

  if (result === 'home_win') return match.awayTeam;
  if (result === 'away_win') return match.homeTeam;
  return null;
}

/**
 * Check if match ended in a draw
 */
export function isMatchDraw(match: Match): boolean {
  return getMatchResult(match) === 'draw';
}

/**
 * Get total goals scored in match
 */
export function getTotalGoals(match: Match): number {
  return match.score.home + match.score.away;
}

/**
 * Check if match is high scoring (more than 2.5 goals)
 */
export function isHighScoringMatch(match: Match): boolean {
  return getTotalGoals(match) > 2.5;
}

/**
 * Check if both teams scored
 */
export function bothTeamsScored(match: Match): boolean {
  return match.score.home > 0 && match.score.away > 0;
}

/**
 * Get goal difference
 */
export function getGoalDifference(match: Match): number {
  return Math.abs(match.score.home - match.score.away);
}

/**
 * Check if match was a clean sheet for home team
 */
export function isHomeCleanSheet(match: Match): boolean {
  return match.score.away === 0 && isMatchFinished(match);
}

/**
 * Check if match was a clean sheet for away team
 */
export function isAwayCleanSheet(match: Match): boolean {
  return match.score.home === 0 && isMatchFinished(match);
}

/**
 * Get match events by type
 */
export function getEventsByType(match: Match, eventType: MatchEvent['type']): MatchEvent[] {
  return match.events.filter((event) => event.type === eventType);
}

/**
 * Get goals scored in match
 */
export function getGoals(match: Match): MatchEvent[] {
  return getEventsByType(match, 'goal')
    .concat(getEventsByType(match, 'penalty_goal'))
    .concat(getEventsByType(match, 'own_goal'))
    .sort((a, b) => a.minute - b.minute);
}

/**
 * Get cards shown in match
 */
export function getCards(match: Match): MatchEvent[] {
  return getEventsByType(match, 'yellow_card')
    .concat(getEventsByType(match, 'red_card'))
    .sort((a, b) => a.minute - b.minute);
}

/**
 * Get substitutions made in match
 */
export function getSubstitutions(match: Match): MatchEvent[] {
  return getEventsByType(match, 'substitution').sort((a, b) => a.minute - b.minute);
}

/**
 * Get events for a specific team
 */
export function getTeamEvents(match: Match, team: 'home' | 'away'): MatchEvent[] {
  return match.events.filter((event) => event.team === team);
}

/**
 * Get home team events
 */
export function getHomeTeamEvents(match: Match): MatchEvent[] {
  return getTeamEvents(match, 'home');
}

/**
 * Get away team events
 */
export function getAwayTeamEvents(match: Match): MatchEvent[] {
  return getTeamEvents(match, 'away');
}

/**
 * Check if match has statistics
 */
export function hasStatistics(match: Match): boolean {
  return !!match.statistics;
}

/**
 * Get possession percentage for a team
 */
export function getTeamPossession(match: Match, team: 'home' | 'away'): number {
  if (!match.statistics) return 0;
  return match.statistics.possession[team];
}

/**
 * Get shots for a team
 */
export function getTeamShots(match: Match, team: 'home' | 'away'): number {
  if (!match.statistics) return 0;
  return match.statistics.shots[team];
}

/**
 * Get shots on target for a team
 */
export function getTeamShotsOnTarget(match: Match, team: 'home' | 'away'): number {
  if (!match.statistics) return 0;
  return match.statistics.shotsOnTarget[team];
}

/**
 * Calculate shot accuracy for a team
 */
export function getTeamShotAccuracy(match: Match, team: 'home' | 'away'): number {
  if (!match.statistics) return 0;

  const shots = match.statistics.shots[team];
  const shotsOnTarget = match.statistics.shotsOnTarget[team];

  if (shots === 0) return 0;
  return Math.round((shotsOnTarget / shots) * 100);
}

/**
 * Check if match has weather information
 */
export function hasWeatherInfo(match: Match): boolean {
  return !!match.weather;
}

/**
 * Get weather description
 */
export function getWeatherDescription(weather: WeatherConditions): string {
  return `${weather.conditions}, ${weather.temperature}°C, ${weather.humidity}% humidity, ${weather.windSpeed} km/h wind`;
}

/**
 * Check if weather conditions are favorable
 */
export function isFavorableWeather(weather: WeatherConditions): boolean {
  return (
    weather.temperature >= 10 &&
    weather.temperature <= 30 &&
    weather.windSpeed < 20 &&
    !weather.conditions.toLowerCase().includes('rain') &&
    !weather.conditions.toLowerCase().includes('snow')
  );
}

/**
 * Get match importance level
 */
export function getImportanceLevel(
  metadata: MatchMetadata
): 'low' | 'medium' | 'high' | 'very_high' {
  const importance = metadata.importance;

  if (importance >= 9) return 'very_high';
  if (importance >= 7) return 'high';
  if (importance >= 5) return 'medium';
  return 'low';
}

/**
 * Check if match is a derby
 */
export function isDerby(match: Match): boolean {
  return !!match.metadata.derby;
}

/**
 * Check if match is a rivalry
 */
export function isRivalry(match: Match): boolean {
  return !!match.metadata.rivalry;
}

/**
 * Check if match is a cup final
 */
export function isCupFinal(match: Match): boolean {
  return !!match.metadata.cupFinal;
}

/**
 * Check if match is a playoff
 */
export function isPlayoff(match: Match): boolean {
  return !!match.metadata.playoff;
}

/**
 * Get match display name
 */
export function getMatchDisplayName(match: Match): string {
  return `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`;
}

/**
 * Get match full name
 */
export function getMatchFullName(match: Match): string {
  return `${match.homeTeam.name} vs ${match.awayTeam.name}`;
}

/**
 * Get match score display
 */
export function getScoreDisplay(match: Match): string {
  if (!isMatchFinished(match) && !isMatchLive(match)) {
    return 'vs';
  }

  return `${match.score.home} - ${match.score.away}`;
}

/**
 * Get halftime score display
 */
export function getHalftimeScoreDisplay(match: Match): string | null {
  if (!match.score.halftime) return null;
  return `${match.score.halftime.home} - ${match.score.halftime.away}`;
}

/**
 * Format match date
 */
export function formatMatchDate(match: Match, locale: string = 'en-US'): string {
  const date = new Date(match.scheduledAt);
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format match time
 */
export function formatMatchTime(match: Match, locale: string = 'en-US'): string {
  const date = new Date(match.scheduledAt);
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format match date and time
 */
export function formatMatchDateTime(match: Match, locale: string = 'en-US'): string {
  const date = new Date(match.scheduledAt);
  return date.toLocaleString(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get time until match starts (in minutes)
 */
export function getTimeUntilMatch(match: Match): number {
  if (isMatchLive(match) || isMatchFinished(match)) {
    return 0;
  }

  const now = new Date();
  const matchTime = new Date(match.scheduledAt);
  return Math.max(0, Math.floor((matchTime.getTime() - now.getTime()) / (1000 * 60)));
}

/**
 * Check if match starts soon (within next hour)
 */
export function isMatchStartingSoon(match: Match): boolean {
  const timeUntil = getTimeUntilMatch(match);
  return timeUntil > 0 && timeUntil <= 60;
}

/**
 * Get team form as string (e.g., "WWDLW")
 */
export function getTeamFormString(form: TeamForm): string {
  return form.recent.join('');
}

/**
 * Calculate team form points (W=3, D=1, L=0)
 */
export function calculateFormPoints(form: TeamForm): number {
  return form.recent.reduce((points: number, result: TeamForm['recent'][number]) => {
    if (result === 'W') return points + 3;
    if (result === 'D') return points + 1;
    return points;
  }, 0);
}

/**
 * Get team win percentage
 */
export function getTeamWinPercentage(stats: TeamStats): number {
  if (stats.played === 0) return 0;
  return Math.round((stats.wins / stats.played) * 100);
}

/**
 * Get team goals per game average
 */
export function getTeamGoalsPerGame(stats: TeamStats): number {
  if (stats.played === 0) return 0;
  return Math.round((stats.goalsFor / stats.played) * 100) / 100;
}

/**
 * Get team goals conceded per game average
 */
export function getTeamGoalsConcededPerGame(stats: TeamStats): number {
  if (stats.played === 0) return 0;
  return Math.round((stats.goalsAgainst / stats.played) * 100) / 100;
}

/**
 * Compare two teams' recent form
 */
export function compareTeamForm(
  team1Form: TeamForm,
  team2Form: TeamForm
): 'team1' | 'team2' | 'equal' {
  const team1Points = calculateFormPoints(team1Form);
  const team2Points = calculateFormPoints(team2Form);

  if (team1Points > team2Points) return 'team1';
  if (team2Points > team1Points) return 'team2';
  return 'equal';
}

/**
 * Get head-to-head record between two teams
 */
export function getHeadToHeadRecord(
  matches: Match[],
  team1Id: string,
  team2Id: string
): {
  team1Wins: number;
  team2Wins: number;
  draws: number;
  totalMatches: number;
} {
  const h2hMatches = matches.filter(
    (match) =>
      isMatchFinished(match) &&
      ((match.homeTeam.id === team1Id && match.awayTeam.id === team2Id) ||
        (match.homeTeam.id === team2Id && match.awayTeam.id === team1Id))
  );

  let team1Wins = 0;
  let team2Wins = 0;
  let draws = 0;

  h2hMatches.forEach((match) => {
    const result = getMatchResult(match);

    if (result === 'draw') {
      draws++;
    } else if (
      (match.homeTeam.id === team1Id && result === 'home_win') ||
      (match.awayTeam.id === team1Id && result === 'away_win')
    ) {
      team1Wins++;
    } else {
      team2Wins++;
    }
  });

  return {
    team1Wins,
    team2Wins,
    draws,
    totalMatches: h2hMatches.length,
  };
}

/**
 * Filter matches by status
 */
export function filterMatchesByStatus(matches: Match[], status: MatchStatus): Match[] {
  return matches.filter((match) => match.status === status);
}

/**
 * Filter matches by date range
 */
export function filterMatchesByDateRange(
  matches: Match[],
  startDate: Date,
  endDate: Date
): Match[] {
  return matches.filter((match) => {
    const matchDate = new Date(match.scheduledAt);
    return matchDate >= startDate && matchDate <= endDate;
  });
}

/**
 * Filter matches by team
 */
export function filterMatchesByTeam(matches: Match[], teamId: string): Match[] {
  return matches.filter((match) => match.homeTeam.id === teamId || match.awayTeam.id === teamId);
}

/**
 * Filter matches by competition
 */
export function filterMatchesByCompetition(matches: Match[], competitionId: string): Match[] {
  return matches.filter((match) => match.competition.id === competitionId);
}

/**
 * Sort matches by date (newest first by default)
 */
export function sortMatchesByDate(matches: Match[], ascending: boolean = false): Match[] {
  return [...matches].sort((a, b) => {
    const dateA = new Date(a.scheduledAt).getTime();
    const dateB = new Date(b.scheduledAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sort matches by importance
 */
export function sortMatchesByImportance(matches: Match[], ascending: boolean = false): Match[] {
  return [...matches].sort((a, b) => {
    const importanceA = a.metadata.importance;
    const importanceB = b.metadata.importance;
    return ascending ? importanceA - importanceB : importanceB - importanceA;
  });
}

/**
 * Get live matches
 */
export function getLiveMatches(matches: Match[]): Match[] {
  return matches.filter(isMatchLive);
}

/**
 * Get upcoming matches
 */
export function getUpcomingMatches(matches: Match[]): Match[] {
  return matches.filter(isMatchScheduled);
}

/**
 * Get finished matches
 */
export function getFinishedMatches(matches: Match[]): Match[] {
  return matches.filter(isMatchFinished);
}

/**
 * Get today's matches
 */
export function getTodaysMatches(matches: Match[]): Match[] {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  return filterMatchesByDateRange(matches, startOfDay, endOfDay);
}

/**
 * Get matches for a specific date
 */
export function getMatchesForDate(matches: Match[], date: Date): Match[] {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  return filterMatchesByDateRange(matches, startOfDay, endOfDay);
}
