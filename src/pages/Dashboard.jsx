import SeasonSelector from '../components/SeasonSelector';
import CustomTable from '../components/CustomTable';
import OfficialTable from '../components/OfficialTable';
import ComparisonTable from '../components/ComparisonTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import GameweekScrubber from '../components/GameweekScrubber';

export default function Dashboard({
  season, setSeason,
  officialStandings,
  customTable,
  realTable,
  gameweekSnapshots,
  maxGameweek,
  currentGameweek,
  setCurrentGameweek,
  loading,
  error,
  retry,
  onBack,
}) {

  // Determine which table data to display for the current gameweek
  const isAtMaxGameweek = currentGameweek >= maxGameweek || maxGameweek === 0;
  const displayTable = (!isAtMaxGameweek && gameweekSnapshots[currentGameweek])
    ? gameweekSnapshots[currentGameweek]
    : customTable;
  const prevGameweekTable = (currentGameweek > 1 && gameweekSnapshots[currentGameweek - 1])
    ? gameweekSnapshots[currentGameweek - 1]
    : null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="text-blue-300 hover:text-white transition-colors text-sm flex items-center gap-1"
              >
                ← Back
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                ⚡ PowerFlip <span className="text-yellow-400">EPL</span>
              </h1>
              <p className="text-blue-200 text-xs mt-0.5">
                Reverse Strength Scoring System — points based on opponent rank
              </p>
            </div>
          </div>
          <SeasonSelector season={season} onChange={setSeason} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Scoring explanation */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3 text-xs text-gray-600">
          <strong className="text-gray-800">Scoring Rules:</strong>{' '}
          Win vs rank-1 team = <span className="font-semibold text-blue-700">20 pts</span>,
          Win vs rank-20 team = <span className="font-semibold text-blue-700">1 pt</span>.
          Draw = half of opponent&apos;s reverse score (rounded). Loss = 0. Rankings update after every match.
        </div>

        {loading && <LoadingSpinner />}
        {!loading && error && <ErrorMessage message={error} onRetry={retry} />}

        {!loading && !error && (
          <>
            {/* Gameweek Scrubber */}
            {maxGameweek > 0 && (
              <GameweekScrubber
                currentGameweek={currentGameweek}
                maxGameweek={maxGameweek}
                onGameweekChange={setCurrentGameweek}
              />
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                  PowerFlip Custom Table
                  {maxGameweek > 0 && (
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      — after GW{currentGameweek}
                    </span>
                  )}
                </h2>
                <CustomTable
                  customTable={displayTable}
                  officialStandings={officialStandings}
                  prevTable={prevGameweekTable}
                  gameweek={currentGameweek}
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-600 inline-block"></span>
                  Official EPL Table
                </h2>
                <OfficialTable officialStandings={officialStandings} />
              </div>
            </div>

            {/* Real vs Reverse comparison */}
            {realTable.length > 0 && customTable.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
                  Real vs Reverse Table Comparison
                </h2>
                <ComparisonTable realTable={realTable} reverseTable={customTable} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
