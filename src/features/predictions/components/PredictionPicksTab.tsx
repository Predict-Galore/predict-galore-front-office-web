/**
 * Predictions Tab Component
 * Shows comprehensive prediction details including all picks
 */

'use client';

import React from 'react';

interface Pick {
  market: string;
  selectionKey: string;
  selectionLabel: string;
  confidence: number;
  odds: number;
  tip: string;
  recentForm: string;
  homeScore: number;
  awayScore: number;
  tipGoals: number;
  playerId: number;
  playerName: string;
  teamId: number;
  teamName: string;
  subType: string;
}

interface PredictionsTabProps {
  picks?: Array<Record<string, unknown>>;
  isLoading: boolean;
}

const PredictionsTab: React.FC<PredictionsTabProps> = ({ picks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 shadow animate-pulse">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded mb-2" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!picks || picks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow">
        <span className="material-icons text-gray-400 text-5xl mb-2">info</span>
        <div className="text-gray-600">No prediction details available for this match.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-gray-600 mb-2">
        Showing {picks.length} prediction{picks.length !== 1 ? 's' : ''}
      </div>

      {picks.map((pickData, index) => {
        // Type assertion with proper null checks
        const pick = pickData as Partial<Pick>;
        
        return (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow overflow-hidden">
            {/* Pick Header */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 border-b border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-700">sports_soccer</span>
                  <span className="font-semibold text-gray-900">{pick.market || 'N/A'}</span>
                </div>
                {pick.confidence && pick.confidence > 0 && (
                  <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {pick.confidence}% Confidence
                  </span>
                )}
              </div>
            </div>

            {/* Pick Content */}
            <div className="p-4">
              {/* Selection */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Prediction</div>
                <div className="text-lg font-bold text-gray-900">{pick.selectionLabel || 'N/A'}</div>
                {pick.selectionKey && (
                  <div className="text-sm text-gray-600 mt-1">Selection: {pick.selectionKey}</div>
                )}
              </div>

              {/* Additional Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {pick.odds && pick.odds > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Odds</div>
                    <div className="text-lg font-semibold text-gray-900">{Number(pick.odds).toFixed(2)}</div>
                  </div>
                )}

                {pick.tip && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Tip</div>
                    <div className="text-sm font-medium text-gray-900">{pick.tip}</div>
                  </div>
                )}

                {pick.recentForm && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Recent Form</div>
                    <div className="text-sm font-medium text-gray-900">{pick.recentForm}</div>
                  </div>
                )}

                {(pick.homeScore || pick.awayScore) && ((pick.homeScore ?? 0) > 0 || (pick.awayScore ?? 0) > 0) && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Predicted Score</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {pick.homeScore || 0} - {pick.awayScore || 0}
                    </div>
                  </div>
                )}

                {pick.tipGoals && pick.tipGoals > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Tip Goals</div>
                    <div className="text-lg font-semibold text-gray-900">{pick.tipGoals}</div>
                  </div>
                )}

                {pick.playerName && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Player</div>
                    <div className="text-sm font-medium text-gray-900">{pick.playerName}</div>
                  </div>
                )}

                {pick.teamName && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Team</div>
                    <div className="text-sm font-medium text-gray-900">{pick.teamName}</div>
                  </div>
                )}

                {pick.subType && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Sub Type</div>
                    <div className="text-sm font-medium text-gray-900">{pick.subType}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PredictionsTab;
