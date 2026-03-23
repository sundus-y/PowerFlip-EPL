function rowBorderClass(position) {
  if (position <= 4) return 'border-l-4 border-blue-500';
  if (position <= 6) return 'border-l-4 border-orange-400';
  if (position >= 18) return 'border-l-4 border-red-500';
  return 'border-l-4 border-transparent';
}

function positionArrow(customPos, officialPos) {
  if (officialPos === null) return <span className="text-gray-400">-</span>;
  const diff = officialPos - customPos;
  if (diff > 0) return <span className="text-green-600 font-bold">↑{diff}</span>;
  if (diff < 0) return <span className="text-red-500 font-bold">↓{Math.abs(diff)}</span>;
  return <span className="text-gray-400">-</span>;
}

export default function CustomTable({ customTable, officialStandings, prevTable, gameweek }) {
  const officialTable = officialStandings?.standings?.[0]?.table || [];

  const getOfficialPosition = (teamName) => {
    const entry = officialTable.find(
      (t) =>
        t.team.name === teamName ||
        t.team.shortName === teamName
    );
    return entry?.position ?? null;
  };

  const getPrevPosition = (teamName) => {
    if (!prevTable) return null;
    const entry = prevTable.find((t) => t.name === teamName);
    return entry?.position ?? null;
  };

  if (!customTable || customTable.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No data available</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-2 py-2 text-center w-8">#</th>
            <th className="px-3 py-2 text-left">Team</th>
            <th className="px-2 py-2 text-center">P</th>
            <th className="px-2 py-2 text-center">W</th>
            <th className="px-2 py-2 text-center">D</th>
            <th className="px-2 py-2 text-center">L</th>
            <th className="px-2 py-2 text-center">GD</th>
            <th className="px-2 py-2 text-center font-bold">Pts</th>
            <th className="px-2 py-2 text-center">vs Official</th>
          </tr>
        </thead>
        <tbody>
          {customTable.map((team) => {
            const officialPos = getOfficialPosition(team.name);
            const prevPos = getPrevPosition(team.name);
            const movedUp = prevPos != null && team.position < prevPos;
            const movedDown = prevPos != null && team.position > prevPos;
            const animClass = movedUp ? 'row-moved-up' : movedDown ? 'row-moved-down' : '';
            return (
              <tr
                key={`${team.name}-gw${gameweek ?? 'final'}`}
                className={`${rowBorderClass(team.position)} ${animClass} bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors`}
              >
                <td className="px-2 py-1.5 text-center font-semibold text-gray-700">
                  <div className="flex items-center justify-center gap-0.5">
                    <span>{team.position}</span>
                    {movedUp && <span className="text-green-600 text-xs leading-none">▲</span>}
                    {movedDown && <span className="text-red-500 text-xs leading-none">▼</span>}
                  </div>
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    {team.crest && (
                      <img
                        src={team.crest}
                        alt={team.shortName}
                        className="w-5 h-5 object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <span className="font-medium text-gray-900">{team.shortName}</span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-center text-gray-600">{team.played}</td>
                <td className="px-2 py-1.5 text-center text-gray-600">{team.wins}</td>
                <td className="px-2 py-1.5 text-center text-gray-600">{team.draws}</td>
                <td className="px-2 py-1.5 text-center text-gray-600">{team.losses}</td>
                <td className={`px-2 py-1.5 text-center font-medium ${team.goalDifference > 0 ? 'text-green-700' : team.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                </td>
                <td className="px-2 py-1.5 text-center font-bold text-blue-700">{team.points}</td>
                <td className="px-2 py-1.5 text-center">
                  {positionArrow(team.position, officialPos)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex gap-4 text-xs text-gray-500 p-2 bg-gray-50 border-t">
        <span className="flex items-center gap-1"><span className="w-3 h-3 border-l-4 border-blue-500 inline-block"></span> Champions League</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 border-l-4 border-orange-400 inline-block"></span> Europa</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 border-l-4 border-red-500 inline-block"></span> Relegation</span>
      </div>
    </div>
  );
}
