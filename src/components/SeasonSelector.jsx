import { AVAILABLE_SEASONS } from '../hooks/useLeague';

export default function SeasonSelector({ season, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="season-select" className="text-sm font-medium text-white">
        Season:
      </label>
      <select
        id="season-select"
        value={season}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {AVAILABLE_SEASONS.map((s) => (
          <option key={s} value={s}>
            {s}/{String(s + 1).slice(2)}
          </option>
        ))}
      </select>
    </div>
  );
}
