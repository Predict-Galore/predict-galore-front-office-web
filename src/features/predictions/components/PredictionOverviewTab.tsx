/**
 * Overview Tab Component
 * Shows predicted outcome, expert analysis, voting, team form, comparison, and top scorers
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Prediction, DetailedPrediction } from '../model/types';

interface OverviewTabProps {
  prediction: Prediction;
  detailed?: DetailedPrediction;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ prediction, detailed }) => {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  
  // Fallback for missing detailed data
  if (!detailed) {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow">
          <div className="text-gray-600 text-center py-8">
            <span className="material-icons text-gray-400 text-5xl mb-2">info</span>
            <p>No prediction details available.</p>
          </div>
        </div>
      </div>
    );
  }

  // Only access detailed properties after checking it exists
  const analysisText = detailed?.expertAnalysis || '';
  const truncatedAnalysis = analysisText && analysisText.length > 200 ? analysisText.substring(0, 200) + '...' : analysisText;

  // Fallback for missing team data
  const homeTeam = prediction.homeTeam || { id: 0, name: 'Home Team', logoUrl: '', shortName: 'HOME' };
  const awayTeam = prediction.awayTeam || { id: 0, name: 'Away Team', logoUrl: '', shortName: 'AWAY' };

  return (
    <div className="flex flex-col gap-4">
      {/* Predicted Outcome - Only show if data exists */}
      {detailed.predictedOutcome && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-900">Predicted outcome</span>
            <a href="#" className="text-blue-600 text-sm flex items-center gap-1">
              <span className="material-icons text-sm">info</span>
              <span className="text-xs">17:39:04</span>
            </a>
          </div>
          <div className="flex items-center gap-3 mb-3">
            {homeTeam.logoUrl ? (
              <Image
                src={homeTeam.logoUrl}
                alt={homeTeam.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full bg-white border object-contain"
                unoptimized
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
                <span className="text-gray-400 text-xs font-bold">{homeTeam.shortName?.slice(0, 3)}</span>
              </div>
            )}
            <span className="font-semibold text-gray-900 text-sm">{detailed.predictedOutcome}</span>
          </div>
          {detailed.reasoning && (
            <div className="text-gray-600 text-xs leading-relaxed mb-3">{detailed.reasoning}</div>
          )}
          {detailed.confidenceLevel !== undefined && (
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors">
              {detailed.confidenceLevel}% Confidence
            </button>
          )}
        </div>
      )}

      {/* Expert Analysis - Only show if data exists */}
      {analysisText && (
        <div className="bg-black text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold">Expert analysis</span>
            <button className="flex items-center gap-1 text-white/80 hover:text-white">
              <span className="material-icons text-sm">thumb_up</span>
              <span className="text-xs">25</span>
              <span className="material-icons text-sm ml-1">thumb_down</span>
            </button>
          </div>
          <div className="text-white/90 text-xs leading-relaxed mb-2">
            {showFullAnalysis ? analysisText : truncatedAnalysis}
          </div>
          {analysisText.length > 200 && (
            <button
              className="mt-2 text-white/70 hover:text-white text-xs flex items-center gap-1 underline"
              onClick={() => setShowFullAnalysis(!showFullAnalysis)}
            >
              {showFullAnalysis ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Who will win? */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-semibold text-gray-900">Who will win?</span>
          {detailed.totalVotes !== undefined && (
            <span className="text-gray-500 text-xs">Total votes: {detailed.totalVotes}</span>
          )}
        </div>
        <div className="text-gray-600 text-xs mb-4 leading-relaxed">Share your prediction by casting your vote with the community.</div>
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedVote('home')}
            className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 flex-1 transition ${selectedVote === 'home' ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
          >
            {homeTeam.logoUrl ? (
              <Image
                src={homeTeam.logoUrl}
                alt={homeTeam.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full bg-white object-contain"
                unoptimized
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center">
                <span className="text-gray-400 text-xs font-bold">{homeTeam.shortName?.slice(0, 3) || 'HOME'}</span>
              </div>
            )}
          </button>
          <button
            onClick={() => setSelectedVote('draw')}
            className={`px-6 py-3 rounded-xl border-2 font-semibold text-sm transition ${selectedVote === 'draw' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
          >
            Draw
          </button>
          <button
            onClick={() => setSelectedVote('away')}
            className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 flex-1 transition ${selectedVote === 'away' ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
          >
            {awayTeam.logoUrl ? (
              <Image
                src={awayTeam.logoUrl}
                alt={awayTeam.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full bg-white object-contain"
                unoptimized
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center">
                <span className="text-gray-400 text-xs font-bold">{awayTeam.shortName?.slice(0, 3) || 'AWAY'}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Team Form - Only show if data is available */}
      {detailed.homeTeamStats && detailed.awayTeamStats && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-gray-900">Team Form</span>
            <span className="material-icons text-green-600 text-lg">check_circle</span>
          </div>
          <div className="space-y-3">
            {[homeTeam, awayTeam].map((team, teamIdx) => {
              const stats = teamIdx === 0 ? detailed.homeTeamStats : detailed.awayTeamStats;
              return (
                <div key={teamIdx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {team.logoUrl ? (
                      <Image
                        src={team.logoUrl}
                        alt={team.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">{team.shortName?.slice(0, 1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    {(stats?.recentForm || []).slice(0, 5).map((form, idx) => (
                      <span
                        key={idx}
                        className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold ${form === 'W' ? 'bg-green-100 text-green-700' : form === 'L' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {form}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {team.logoUrl ? (
                      <Image
                        src={team.logoUrl}
                        alt={team.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">{team.shortName?.slice(0, 1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team Comparison - Only show if data is available */}
      {detailed.homeTeamStats && detailed.awayTeamStats && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-gray-900">Team Comparison</span>
            <span className="material-icons text-green-600 text-lg">check_circle</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            {homeTeam.logoUrl ? (
              <Image
                src={homeTeam.logoUrl}
                alt={homeTeam.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-contain"
                unoptimized
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            )}
            <span className="text-xs font-semibold text-gray-600 uppercase">Statistics</span>
            {awayTeam.logoUrl ? (
              <Image
                src={awayTeam.logoUrl}
                alt={awayTeam.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-contain"
                unoptimized
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            )}
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Recent Form', home: (detailed.homeTeamStats?.recentForm || []).join('-') || 'N/A', away: (detailed.awayTeamStats?.recentForm || []).join('-') || 'N/A' },
              { label: 'Head-to-Head Wins', home: (detailed.homeTeamStats?.headToHeadWins || []).join('-') || 'N/A', away: (detailed.awayTeamStats?.headToHeadWins || []).join('-') || 'N/A' },
              { label: 'Goals per game', home: detailed.homeTeamStats?.goalsPerGame || 'N/A', away: detailed.awayTeamStats?.goalsPerGame || 'N/A' },
              { label: 'Goals conceded per game', home: detailed.homeTeamStats?.goalsConcededPerGame || 'N/A', away: detailed.awayTeamStats?.goalsConcededPerGame || 'N/A' },
              { label: 'Win percentage', home: `${detailed.homeTeamStats?.winPercentage || 0}%`, away: `${detailed.awayTeamStats?.winPercentage || 0}%` },
              { label: 'Possession percentage', home: `${detailed.homeTeamStats?.possessionPercentage || 0}%`, away: `${detailed.awayTeamStats?.possessionPercentage || 0}%` },
              { label: 'Clean sheets', home: detailed.homeTeamStats?.cleanSheets || 0, away: detailed.awayTeamStats?.cleanSheets || 0 },
            ].map((stat, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 items-center text-xs py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-gray-900 font-medium text-left">{stat.home}</span>
                <span className="text-center text-gray-600 text-xs">{stat.label}</span>
                <span className="text-gray-900 font-medium text-right">{stat.away}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Scorers - Only show if data is available */}
      {(detailed.homeTopScorer || detailed.awayTopScorer) && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-gray-900">Top scorers</span>
            <span className="material-icons text-green-600 text-lg">check_circle</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Home Top Scorer */}
            {detailed.homeTopScorer ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <Image
                    src={detailed.homeTopScorer.playerImage || '/placeholders/player-avatar.svg'}
                    alt={detailed.homeTopScorer.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    unoptimized
                  />
                  {homeTeam.logoUrl && (
                    <Image
                      src={homeTeam.logoUrl}
                      alt={homeTeam.name}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full absolute -bottom-1 -right-1 border-2 border-white object-contain bg-white"
                      unoptimized
                    />
                  )}
                </div>
                <span className="font-semibold text-gray-900 text-sm text-center mb-0.5">{detailed.homeTopScorer.name}</span>
                <span className="text-xs text-gray-500 mb-2">{detailed.homeTopScorer.position}</span>
                <span className="inline-block bg-green-100 text-green-800 font-bold rounded-full px-3 py-1 text-xs mb-3">{detailed.homeTopScorer.rating}</span>
                <div className="w-full space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Age:</span><span className="font-medium text-gray-900">{detailed.homeTopScorer.age}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Height:</span><span className="font-medium text-gray-900">{detailed.homeTopScorer.height}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Weight:</span><span className="font-medium text-gray-900">{detailed.homeTopScorer.weight}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Matches:</span><span className="font-medium text-gray-900">{detailed.homeTopScorer.matches}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Goals:</span><span className="font-medium text-gray-900">{detailed.homeTopScorer.goals}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Assists:</span><span className="font-medium text-gray-900">{detailed.homeTopScorer.assists}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Yellow cards:</span><span className="font-medium text-gray-900">{detailed.homeTopScorer.yellowCards}</span></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <span className="material-icons text-gray-300 text-4xl mb-2">person</span>
                <span className="text-gray-400 text-xs">No data</span>
              </div>
            )}
            {/* Away Top Scorer */}
            {detailed.awayTopScorer ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <Image
                    src={detailed.awayTopScorer.playerImage || '/placeholders/player-avatar.svg'}
                    alt={detailed.awayTopScorer.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    unoptimized
                  />
                  {awayTeam.logoUrl && (
                    <Image
                      src={awayTeam.logoUrl}
                      alt={awayTeam.name}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full absolute -bottom-1 -right-1 border-2 border-white object-contain bg-white"
                      unoptimized
                    />
                  )}
                </div>
                <span className="font-semibold text-gray-900 text-sm text-center mb-0.5">{detailed.awayTopScorer.name}</span>
                <span className="text-xs text-gray-500 mb-2">{detailed.awayTopScorer.position}</span>
                <span className="inline-block bg-green-100 text-green-800 font-bold rounded-full px-3 py-1 text-xs mb-3">{detailed.awayTopScorer.rating}</span>
                <div className="w-full space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Age:</span><span className="font-medium text-gray-900">{detailed.awayTopScorer.age}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Height:</span><span className="font-medium text-gray-900">{detailed.awayTopScorer.height}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Weight:</span><span className="font-medium text-gray-900">{detailed.awayTopScorer.weight}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Matches:</span><span className="font-medium text-gray-900">{detailed.awayTopScorer.matches}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Goals:</span><span className="font-medium text-gray-900">{detailed.awayTopScorer.goals}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Assists:</span><span className="font-medium text-gray-900">{detailed.awayTopScorer.assists}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Yellow cards:</span><span className="font-medium text-gray-900">{detailed.awayTopScorer.yellowCards}</span></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <span className="material-icons text-gray-300 text-4xl mb-2">person</span>
                <span className="text-gray-400 text-xs">No data</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
