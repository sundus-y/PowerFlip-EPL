import { useState, useEffect } from 'react';

export default function GameweekScrubber({ currentGameweek, maxGameweek, onGameweekChange }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-advance one gameweek every 250 ms (4 gameweeks/second) while playing.
  // When we reach the last gameweek, don't schedule any more advances;
  // the isPlaying flag is cleared via the play/pause button's restart logic.
  useEffect(() => {
    if (!isPlaying || currentGameweek >= maxGameweek) return;

    const timer = setTimeout(() => {
      onGameweekChange(currentGameweek + 1);
    }, 250);

    return () => clearTimeout(timer);
  }, [isPlaying, currentGameweek, maxGameweek, onGameweekChange]);

  // Whether we are actively counting down to the next gameweek
  const advancing = isPlaying && currentGameweek < maxGameweek;

  const handlePlayPause = () => {
    if (advancing) {
      setIsPlaying(false);
    } else {
      // Restart from the beginning if already at end, otherwise resume/start
      if (currentGameweek >= maxGameweek) {
        onGameweekChange(1);
      }
      setIsPlaying(true);
    }
  };

  const handleSliderChange = (e) => {
    setIsPlaying(false);
    onGameweekChange(Number(e.target.value));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    onGameweekChange(Math.max(1, currentGameweek - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    onGameweekChange(Math.min(maxGameweek, currentGameweek + 1));
  };

  if (maxGameweek === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Play / Pause button */}
        <button
          onClick={handlePlayPause}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm"
          aria-label={advancing ? 'Pause' : currentGameweek >= maxGameweek ? 'Restart' : 'Play'}
          title={advancing ? 'Pause' : currentGameweek >= maxGameweek ? 'Restart from GW1' : 'Play (1 gameweek / 2 s)'}
        >
          {advancing ? '⏸' : currentGameweek >= maxGameweek ? '↺' : '▶'}
        </button>

        {/* Previous gameweek */}
        <button
          onClick={handlePrev}
          disabled={currentGameweek <= 1}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base"
          aria-label="Previous gameweek"
        >
          ‹
        </button>

        {/* Slider */}
        <div className="flex-1 flex flex-col gap-0.5">
          <input
            type="range"
            min={1}
            max={maxGameweek}
            value={currentGameweek}
            onChange={handleSliderChange}
            className="w-full h-2 cursor-pointer accent-blue-600"
            aria-label="Gameweek"
          />
          {/* Tick marks at GW1, midpoint, and last GW */}
          <div className="flex justify-between text-xs text-gray-400 px-0.5 select-none">
            <span>GW1</span>
            {maxGameweek > 2 && <span>GW{Math.round(maxGameweek / 2)}</span>}
            <span>GW{maxGameweek}</span>
          </div>
        </div>

        {/* Next gameweek */}
        <button
          onClick={handleNext}
          disabled={currentGameweek >= maxGameweek}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base"
          aria-label="Next gameweek"
        >
          ›
        </button>

        {/* Label */}
        <span className="flex-shrink-0 text-sm font-semibold text-gray-700 min-w-[5.5rem] text-right tabular-nums">
          GW {currentGameweek}
          <span className="font-normal text-gray-400"> / {maxGameweek}</span>
        </span>
      </div>
    </div>
  );
}
