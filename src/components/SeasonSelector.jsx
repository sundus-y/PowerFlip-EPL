const SEASONS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

export default function SeasonSelector({ season, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="season-select" className="text-sm font-medium text-gray-700">
        Season:
      </label>
      <select
        id="season-select"
        value={season}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {SEASONS.map((s) => (
          <option key={s} value={s}>
            {s}/{String(s + 1).slice(2)}{s === 2023 ? ' (Demo)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
