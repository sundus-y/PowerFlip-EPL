/**
 * ComparisonTable
 *
 * Shows:
 * 1. Champion comparison — Real champion vs Reverse champion
 * 2. Position difference table — sorted by biggest absolute position change
 */
export default function ComparisonTable({ realTable, reverseTable }) {
  if (!realTable || realTable.length === 0 || !reverseTable || reverseTable.length === 0) {
    return null;
  }

  const realChampion = realTable.find((t) => t.position === 1);
  const reverseChampion = reverseTable.find((t) => t.position === 1);
  const championsMatch =
    realChampion && reverseChampion && realChampion.name === reverseChampion.name;

  // Build per-team comparison rows
  const rows = reverseTable.map((revTeam) => {
    const realTeam = realTable.find(
      (t) => t.name === revTeam.name || t.shortName === revTeam.shortName
    );
    const realPos = realTeam?.position ?? null;
    const reversePos = revTeam.position;
    const diff = realPos != null ? realPos - reversePos : null;
    return {
      name: revTeam.name,
      shortName: revTeam.shortName,
      crest: revTeam.crest,
      realPos,
      reversePos,
      diff,
    };
  });

  // Sort by biggest absolute difference (nulls last)
  const sorted = [...rows].sort((a, b) => {
    if (a.diff == null && b.diff == null) return 0;
    if (a.diff == null) return 1;
    if (b.diff == null) return -1;
    return Math.abs(b.diff) - Math.abs(a.diff);
  });

  return (
    <div className="space-y-6">
      {/* Champion comparison banner */}
      <div
        className={`rounded-lg border shadow-sm px-5 py-4 ${
          championsMatch
            ? 'bg-green-50 border-green-200'
            : 'bg-amber-50 border-amber-200'
        }`}
      >
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          Champion Comparison
          {!championsMatch && (
            <span className="text-xs font-normal text-amber-700 bg-amber-100 rounded px-2 py-0.5">
              Different Champions!
            </span>
          )}
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3 bg-white rounded-md border border-gray-200 px-4 py-3">
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Real Champion</p>
              {realChampion ? (
                <div className="flex items-center gap-2">
                  {realChampion.crest && (
                    <img
                      src={realChampion.crest}
                      alt={realChampion.shortName}
                      className="w-5 h-5 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span className="font-semibold text-gray-900">
                    {realChampion.shortName}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">—</span>
              )}
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 bg-white rounded-md border border-gray-200 px-4 py-3">
            <span className="text-xl">🔄</span>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Reverse Champion</p>
              {reverseChampion ? (
                <div className="flex items-center gap-2">
                  {reverseChampion.crest && (
                    <img
                      src={reverseChampion.crest}
                      alt={reverseChampion.shortName}
                      className="w-5 h-5 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span className="font-semibold text-gray-900">
                    {reverseChampion.shortName}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Position difference table */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
          Position Difference Analysis
          <span className="ml-1 text-xs font-normal text-gray-400">
            — sorted by biggest change
          </span>
        </h3>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-3 py-2 text-left">Team</th>
                <th className="px-3 py-2 text-center">Real Position</th>
                <th className="px-3 py-2 text-center">Reverse Position</th>
                <th className="px-3 py-2 text-center">Difference</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const absDiff = row.diff != null ? Math.abs(row.diff) : null;
                const diffLabel =
                  row.diff == null
                    ? '—'
                    : row.diff > 0
                    ? `+${row.diff}`
                    : row.diff < 0
                    ? `${row.diff}`
                    : '0';
                const diffColor =
                  row.diff == null || row.diff === 0
                    ? 'text-gray-400'
                    : row.diff > 0
                    ? 'text-green-700'
                    : 'text-red-600';
                const highlightBg =
                  absDiff != null && absDiff >= 5
                    ? 'bg-purple-50'
                    : 'bg-white even:bg-gray-50';
                return (
                  <tr
                    key={row.name}
                    className={`${highlightBg} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        {row.crest && (
                          <img
                            src={row.crest}
                            alt={row.shortName}
                            className="w-5 h-5 object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <span className="font-medium text-gray-900">
                          {row.shortName}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-center text-gray-700 font-medium">
                      {row.realPos ?? '—'}
                    </td>
                    <td className="px-3 py-1.5 text-center text-gray-700 font-medium">
                      {row.reversePos}
                    </td>
                    <td className={`px-3 py-1.5 text-center font-bold ${diffColor}`}>
                      {diffLabel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-xs text-gray-500 p-2 bg-gray-50 border-t">
            Difference = Real Position − Reverse Position. Positive means the team ranked
            higher in the real table; negative means they ranked higher in the reverse table.
            <span className="ml-2 inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-purple-50 border border-purple-200 inline-block rounded-sm"></span>
              5+ position swing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
