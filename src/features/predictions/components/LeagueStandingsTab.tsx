/**
 * Table Tab Component
 * Shows league standings table
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { LeagueTableEntry } from '../model/types';
import { useLeagueTable } from '../api/hooks';

interface TableTabProps {
  leagueId?: number;
  tableData?: LeagueTableEntry[];
  isLoading?: boolean;
}

const TableTab: React.FC<TableTabProps> = ({ leagueId, tableData: propTableData, isLoading: propIsLoading }) => {
  // Use the hook to fetch league table data if not provided as props
  const { 
    data: hookTableData = [], 
    isLoading: hookIsLoading 
  } = useLeagueTable(leagueId ?? null, { 
    enabled: !!leagueId && !propTableData 
  });

  // Use prop data if available, otherwise use hook data
  const tableData = propTableData || hookTableData;
  const isLoading = propIsLoading ?? hookIsLoading;

  // Helper to render form circles
  const renderForm = (form?: string[]) => {
    if (!form || form.length === 0) return null;
    return (
      <div className="flex gap-1">
        {form.slice(0, 5).map((result, idx) => (
          <div
            key={idx}
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              result === 'W'
                ? 'bg-green-600 text-white'
                : result === 'D'
                ? 'bg-gray-400 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {result}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-black rounded-xl overflow-hidden">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-800 rounded mb-4" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 mb-3">
                <div className="w-8 h-4 bg-gray-800 rounded" />
                <div className="w-8 h-8 bg-gray-800 rounded-full" />
                <div className="flex-1 h-4 bg-gray-800 rounded" />
                <div className="w-8 h-4 bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tableData.length === 0) {
    return (
      <div className="bg-black rounded-xl p-8 text-center">
        <span className="material-icons text-gray-600 text-5xl mb-2">table_chart</span>
        <div className="text-gray-400">League table data is not available.</div>
        {leagueId && (
          <div className="text-xs text-gray-600 mt-2">League ID: {leagueId}</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl overflow-hidden">
      {/* League Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
          <span className="text-xs font-bold text-black">PL</span>
        </div>
        <span className="text-white text-sm font-medium">Premier League</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-3 py-2.5 font-medium text-gray-400 text-left">#</th>
              <th className="px-3 py-2.5 font-medium text-gray-400 text-left">Team</th>
              <th className="px-2 py-2.5 font-medium text-gray-400 text-center">Pl</th>
              <th className="px-2 py-2.5 font-medium text-gray-400 text-center">W</th>
              <th className="px-2 py-2.5 font-medium text-gray-400 text-center">D</th>
              <th className="px-2 py-2.5 font-medium text-gray-400 text-center">L</th>
              <th className="px-2 py-2.5 font-medium text-gray-400 text-center">+/-</th>
              <th className="px-2 py-2.5 font-medium text-gray-400 text-center">GD</th>
              <th className="px-2 py-2.5 font-medium text-gray-400 text-center">Pts</th>
              <th className="px-3 py-2.5 font-medium text-gray-400 text-left">Form</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((entry) => {
              // Determine qualification color
              let qualificationColor = '';
              if (entry.qualification === 'champions-league') {
                qualificationColor = 'border-l-4 border-l-green-500';
              } else if (entry.qualification === 'europa-league') {
                qualificationColor = 'border-l-4 border-l-blue-500';
              } else if (entry.qualification === 'relegation') {
                qualificationColor = 'border-l-4 border-l-red-500';
              }

              return (
                <tr
                  key={entry.team.id}
                  className={`border-b border-gray-900 hover:bg-gray-900/50 transition-colors ${qualificationColor}`}
                >
                  <td className="px-3 py-3 text-gray-400 font-medium">{entry.position}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src={entry.team.logoUrl}
                        alt={entry.team.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                        unoptimized
                      />
                      <span className="text-white text-xs font-medium">{entry.team.shortName || entry.team.name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center text-gray-300">{entry.played}</td>
                  <td className="px-2 py-3 text-center text-gray-300">{entry.wins}</td>
                  <td className="px-2 py-3 text-center text-gray-300">{entry.draws}</td>
                  <td className="px-2 py-3 text-center text-gray-300">{entry.losses}</td>
                  <td className="px-2 py-3 text-center text-gray-300">{entry.goalsFor}-{entry.goalsAgainst}</td>
                  <td className="px-2 py-3 text-center text-gray-300 font-semibold">
                    {entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}
                  </td>
                  <td className="px-2 py-3 text-center text-white font-bold">{entry.points}</td>
                  <td className="px-3 py-3">
                    {renderForm(entry.form)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-gray-800 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          <span className="text-xs text-gray-400">Champions League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          <span className="text-xs text-gray-400">Europa League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span className="text-xs text-gray-400">Relegation</span>
        </div>
      </div>
    </div>
  );
};

export default TableTab;
