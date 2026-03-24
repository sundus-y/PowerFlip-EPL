import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// 20 distinct colours for up to 20 EPL teams
const TEAM_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#a3e635',
  '#6366f1', '#84cc16', '#fb923c', '#e879f9', '#38bdf8',
  '#4ade80', '#fbbf24', '#f43f5e', '#a78bfa', '#2dd4bf',
];

/**
 * Transforms gameweekSnapshots into the flat array Recharts expects:
 * [{ gw: 1, "Man City": 3, Arsenal: 1, ... }, ...]
 */
function buildChartData(snapshots, maxGameweek) {
  const data = [];
  for (let gw = 1; gw <= maxGameweek; gw++) {
    if (!snapshots[gw]) continue;
    const entry = { gw };
    for (const team of snapshots[gw]) {
      entry[team.shortName] = team.position;
    }
    data.push(entry);
  }
  return data;
}

/** Custom tooltip that shows rank position for each visible team */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  const sorted = [...payload].sort((a, b) => a.value - b.value);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs max-w-[200px]">
      <p className="font-semibold text-gray-700 mb-1.5 border-b pb-1">GW {label}</p>
      {sorted.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-3 py-0.5">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.dataKey}</span>
          </span>
          <span className="font-bold text-gray-900">#{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * RankOverTimeChart
 *
 * Props:
 *   gameweekSnapshots – array produced by getGameweekSnapshots()
 *                        (index = gameweek number, value = table snapshot)
 *   maxGameweek       – highest gameweek with data
 */
export default function RankOverTimeChart({ gameweekSnapshots, maxGameweek }) {
  // Derive the full team list from the first available snapshot
  let allTeams = [];
  for (let gw = 1; gw <= maxGameweek; gw++) {
    if (gameweekSnapshots[gw]?.length) {
      allTeams = gameweekSnapshots[gw].map((t) => t.shortName);
      break;
    }
  }

  // Default: show the 6 teams that finish highest (lowest position number)
  const lastSnapshot = gameweekSnapshots[maxGameweek];
  const defaultVisible = new Set(
    lastSnapshot
      ? [...lastSnapshot]
          .sort((a, b) => a.position - b.position)
          .slice(0, 6)
          .map((t) => t.shortName)
      : allTeams.slice(0, 6)
  );

  const [visibleTeams, setVisibleTeams] = useState(() => defaultVisible);

  const chartData = buildChartData(gameweekSnapshots, maxGameweek);

  function toggleTeam(shortName) {
    setVisibleTeams((prev) => {
      const next = new Set(prev);
      if (next.has(shortName)) {
        next.delete(shortName);
      } else {
        next.add(shortName);
      }
      return next;
    });
  }

  function selectAll() {
    setVisibleTeams(new Set(allTeams));
  }

  function selectNone() {
    setVisibleTeams(new Set());
  }

  if (!chartData.length || !allTeams.length) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            Rank Over Time
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            PowerFlip reverse-scoring positions by gameweek — rank 1 is best
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={selectAll}
            className="px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            All
          </button>
          <button
            onClick={selectNone}
            className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            None
          </button>
        </div>
      </div>

      {/* Team toggle buttons */}
      <div className="flex flex-wrap gap-1.5">
        {allTeams.map((shortName, idx) => {
          const color = TEAM_COLORS[idx % TEAM_COLORS.length];
          const active = visibleTeams.has(shortName);
          return (
            <button
              key={shortName}
              onClick={() => toggleTeam(shortName)}
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all ${
                active
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-white text-gray-500 border-gray-300 opacity-60'
              }`}
              style={active ? { backgroundColor: color, borderColor: color } : {}}
            >
              {shortName}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="gw"
            label={{ value: 'Gameweek', position: 'insideBottomRight', offset: -5, fontSize: 11 }}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            reversed
            domain={[1, 20]}
            ticks={[1, 5, 10, 15, 20]}
            label={{ value: 'Position', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
            tick={{ fontSize: 10 }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          />
          {allTeams.map((shortName, idx) =>
            visibleTeams.has(shortName) ? (
              <Line
                key={shortName}
                type="monotone"
                dataKey={shortName}
                stroke={TEAM_COLORS[idx % TEAM_COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
