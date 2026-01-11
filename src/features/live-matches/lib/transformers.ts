/**
 * LIVE MATCHES TRANSFORMERS
 *
 * Business logic for data transformation
 */

import type { Match, Team, MatchStatus, LiveSection } from '../model/types';
import type { BackendFixture, BackendLiveScoresResponse, LiveScoresResponse } from '../api/types';

/**
 * Generate dynamic logo with team initials
 */
function generateDynamicLogo(teamName: string): string {
  const words = teamName.split(' ');
  let initials = '';

  if (words.length >= 2) {
    initials = words[0].charAt(0) + words[words.length - 1].charAt(0);
  } else if (teamName.length >= 2) {
    initials = teamName.substring(0, 2);
  } else {
    initials = teamName.charAt(0) || 'TM';
  }

  initials = initials.toUpperCase();

  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const intToRGB = (i: number): string => {
    const c = (i & 0x00ffffff).toString(16).toUpperCase();
    return '00000'.substring(0, 6 - c.length) + c;
  };

  const color = intToRGB(hashCode(teamName));
  const bgColor = color.substring(0, 6);
  const textColor = parseInt(bgColor, 16) > 0x888888 ? '000000' : 'FFFFFF';

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=${textColor}&bold=true&size=128`;
}

/**
 * Transform backend status to frontend status
 */
function mapBackendStatus(backendStatus: string): MatchStatus {
  switch (backendStatus) {
    case '1H':
    case '2H':
      return 'Live';
    case 'HT':
      return 'HT';
    case 'ET':
      return 'ET';
    case 'FT':
      return 'FT';
    case 'POSTPONED':
    case 'CANCELLED':
    default:
      return 'Prediction';
  }
}

/**
 * Create team object with fallback logo
 */
function createTeam(
  teamName: string,
  teamLogo: string | undefined,
  fixtureId: number,
  isHome: boolean
): Team {
  const fallbackLogo = generateDynamicLogo(teamName);
  const shortName =
    teamName.length >= 3 ? teamName.substring(0, 3).toUpperCase() : teamName.toUpperCase();

  return {
    id: `${isHome ? 'home' : 'away'}-${fixtureId}`,
    name: teamName,
    logoUrl: teamLogo || fallbackLogo,
    shortName,
  };
}

/**
 * Transform backend fixture to frontend match
 */
function transformBackendFixture(fixture: BackendFixture): Match {
  const result = `${fixture.homeScore}-${fixture.awayScore}`;

  const kickoffTime = new Date(fixture.kickoffUtc);
  const now = new Date();
  const isUpcoming = kickoffTime > now;

  const status = isUpcoming ? 'Prediction' : mapBackendStatus(fixture.status);

  return {
    id: fixture.providerFixtureId.toString(),
    homeTeam: createTeam(fixture.homeTeam, fixture.homeTeamLogo, fixture.providerFixtureId, true),
    awayTeam: createTeam(fixture.awayTeam, fixture.awayTeamLogo, fixture.providerFixtureId, false),
    result: result,
    status: status,
    dateTime: fixture.kickoffUtc,
    stadium: 'Unknown Stadium',
    competition: fixture.league,
    sport: 'soccer',
  };
}

export class LiveMatchesTransformer {
  /**
   * Transform backend response to frontend format
   */
  static transformBackendResponse(backendData: BackendLiveScoresResponse): LiveScoresResponse {
    if (!backendData?.success || !Array.isArray(backendData.data)) {
      return {
        sections: [],
        liveViewers: 0,
        lastUpdated: new Date(),
        totalMatches: 0,
      };
    }

    const matches = backendData.data.map(transformBackendFixture);

    // Group matches by status for sections
    const liveMatches = matches.filter((match) => match.status === 'Live');
    const predictionMatches = matches.filter((match) => match.status === 'Prediction');
    const resultMatches = matches.filter(
      (match) => match.status === 'FT' || match.status === 'HT' || match.status === 'ET'
    );

    const sections: LiveSection[] = [];

    if (liveMatches.length > 0) {
      sections.push({
        id: 'live-matches',
        title: 'Live Matches',
        matches: liveMatches,
        variant: 'Live',
      });
    }

    if (predictionMatches.length > 0) {
      sections.push({
        id: 'upcoming-matches',
        title: 'Upcoming Matches',
        matches: predictionMatches,
        variant: 'Prediction',
      });
    }

    if (resultMatches.length > 0) {
      sections.push({
        id: 'recent-results',
        title: 'Recent Results',
        matches: resultMatches,
        variant: 'Result',
      });
    }

    return {
      sections,
      liveViewers: 0,
      lastUpdated: new Date(),
      totalMatches: matches.length,
    };
  }

  /**
   * Transform single fixture
   */
  static transformFixture(fixture: BackendFixture): Match {
    return transformBackendFixture(fixture);
  }
}
