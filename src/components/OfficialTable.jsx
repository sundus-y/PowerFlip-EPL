function rowBorderClass(position) {
  if (position <= 4) return 'border-l-4 border-blue-500';
  if (position <= 6) return 'border-l-4 border-orange-400';
  if (position >= 18) return 'border-l-4 border-red-500';
  return 'border-l-4 border-transparent';
}

export default function OfficialTable({ officialStandings }) {
  const table = officialStandings?.standings?.[0]?.table || [];

  if (table.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No official data available</div>
    );
  }

  return (
    <div className="rounded-lg shadow overflow-hidden">
    <div className="overflow-x-auto overflow-y-auto max-h-[230px]">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-800 text-white sticky top-0 z-10">
          <tr>
            <th className="px-2 py-2 text-center w-8">#</th>
            <th className="px-3 py-2 text-left">Team</th>
            <th className="px-2 py-2 text-center">P</th>
            <th className="px-2 py-2 text-center">W</th>
            <th className="px-2 py-2 text-center">D</th>
            <th className="px-2 py-2 text-center">L</th>
            <th className="px-2 py-2 text-center">GD</th>
            <th className="px-2 py-2 text-center font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((entry) => (
            <tr
              key={entry.team.id}
              className={`${rowBorderClass(entry.position)} bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors`}
            >
              <td className="px-2 py-1.5 text-center font-semibold text-gray-700">
                {entry.position}
              </td>
              <td className="px-3 py-1.5">
                <div className="flex items-center gap-2">
                  {entry.team.crest && (
                    <img
                      src={entry.team.crest}
                      alt={entry.team.shortName}
                      className="w-5 h-5 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span className="font-medium text-gray-900">{entry.team.shortName}</span>
                </div>
              </td>
              <td className="px-2 py-1.5 text-center text-gray-600">{entry.playedGames}</td>
              <td className="px-2 py-1.5 text-center text-gray-600">{entry.won}</td>
              <td className="px-2 py-1.5 text-center text-gray-600">{entry.draw}</td>
              <td className="px-2 py-1.5 text-center text-gray-600">{entry.lost}</td>
              <td className={`px-2 py-1.5 text-center font-medium ${entry.goalDifference > 0 ? 'text-green-700' : entry.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}
              </td>
              <td className="px-2 py-1.5 text-center font-bold text-gray-800">{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex gap-4 text-xs text-gray-500 p-2 bg-gray-50 border-t">
      <span className="flex items-center gap-1"><span className="w-3 h-3 border-l-4 border-blue-500 inline-block"></span> Champions League</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 border-l-4 border-orange-400 inline-block"></span> Europa</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 border-l-4 border-red-500 inline-block"></span> Relegation</span>
    </div>
    </div>
  );
}
