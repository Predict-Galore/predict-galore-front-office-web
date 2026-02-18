/**
 * Match Header Component
 * Displays match information with tabs (Overview, Predictions, Table)
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { Prediction } from '../model/types';
import dayjs from 'dayjs';

interface MatchHeaderProps {
  prediction: Prediction;
  activeTab: 'overview' | 'predictions' | 'table';
  onTabChange: (tab: 'overview' | 'predictions' | 'table') => void;
  onBack: () => void;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({ prediction, activeTab, onTabChange, onBack }) => {
  const formatDateTime = (dateString: string) => {
    const date = dayjs(dateString);
    return date.format('DD.MM.YYYY • HH:mm');
  };

  // Fallback for missing team data
  const homeTeam = prediction.homeTeam || { id: 0, name: 'Home Team', logoUrl: '', shortName: 'HOME' };
  const awayTeam = prediction.awayTeam || { id: 0, name: 'Away Team', logoUrl: '', shortName: 'AWAY' };

  return (
    <div className="w-full bg-[#1a4d2e] text-white rounded-2xl overflow-hidden border border-[#1a4d2e]/20">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onBack} className="rounded-full p-2 hover:bg-white/10" aria-label="Back">
          <span className="material-icons text-white">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 hover:bg-white/10" aria-label="Share">
            <span className="material-icons text-white">share</span>
          </button>
          <button className="rounded-full p-2 hover:bg-white/10" aria-label="Notifications">
            <span className="material-icons text-white">notifications</span>
          </button>
        </div>
      </div>

      {/* Date/Time Pill */}
      <div className="flex justify-center px-4 pb-3">
        <span className="inline-block bg-white/20 text-white font-medium rounded-full px-4 py-1.5 text-xs">
          {prediction.startTime ? formatDateTime(prediction.startTime) : 'Date TBD'}
        </span>
      </div>

      {/* Teams and Score */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-center gap-8 md:gap-12">
          {/* Home Team */}
          <div className="flex flex-col items-center">
            {homeTeam.logoUrl ? (
              <Image
                src={homeTeam.logoUrl}
                alt={homeTeam.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full mb-2 bg-white object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="w-14 h-14 rounded-full mb-2 bg-white flex items-center justify-center">
                <span className="text-gray-400 text-xs font-bold">{homeTeam.shortName?.slice(0, 3) || 'HOME'}</span>
              </div>
            )}
            <span className="text-xs font-semibold uppercase text-center text-white/90">
              {homeTeam.shortName || homeTeam.name}
            </span>
          </div>
          {/* Score */}
          <div className="flex flex-col items-center">
            <span className="text-5xl md:text-6xl font-black mb-1 leading-none tracking-tight">
              {prediction.predictedScore || '0-0'}
            </span>
            <span className="text-xs font-medium text-white/80 capitalize">Prediction</span>
          </div>
          {/* Away Team */}
          <div className="flex flex-col items-center">
            {awayTeam.logoUrl ? (
              <Image
                src={awayTeam.logoUrl}
                alt={awayTeam.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full mb-2 bg-white object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="w-14 h-14 rounded-full mb-2 bg-white flex items-center justify-center">
                <span className="text-gray-400 text-xs font-bold">{awayTeam.shortName?.slice(0, 3) || 'AWAY'}</span>
              </div>
            )}
            <span className="text-xs font-semibold uppercase text-center text-white/90">
              {awayTeam.shortName || awayTeam.name}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-white/20 bg-white/5">
        <button
          onClick={() => onTabChange('overview')}
          className={`flex-1 py-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'border-white text-white bg-white/10' : 'border-transparent text-white/60 hover:text-white/90'}`}
        >
          Overview
        </button>
        <button
          onClick={() => onTabChange('predictions')}
          className={`flex-1 py-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'predictions' ? 'border-white text-white bg-white/10' : 'border-transparent text-white/60 hover:text-white/90'}`}
        >
          Predictions
        </button>
        <button
          onClick={() => onTabChange('table')}
          className={`flex-1 py-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'table' ? 'border-white text-white bg-white/10' : 'border-transparent text-white/60 hover:text-white/90'}`}
        >
          Table
        </button>
      </div>
    </div>
  );
};

export default MatchHeader;
