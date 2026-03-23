# PowerFlip-EPL

A React.js web application that redefines how the English Premier League table is calculated using a custom **reverse strength scoring system**.

## 🧠 Core Concept

Instead of fixed points (3/1/0), teams earn points based on the **current ranking** of their opponent. Beating stronger opponents yields higher rewards.

## 📐 Scoring Rules

- **Total teams:** 20
- **Reverse position formula:** `reverse_position = (21 - opponent_position)`
- **Win:** `points = reverse_position(opponent)` (e.g. beating 1st place = 20 pts)
- **Draw:** `points = round(reverse_position(opponent) / 2)`
- **Loss:** `points = 0`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A free API key from [football-data.org](https://www.football-data.org/) (optional — demo data is included for the 2023/24 season)

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### API Key (Optional)

To load live data for any season (2015–2024), create a `.env` file:

```
VITE_API_KEY=your_api_key_here
```

Or enter your API key directly in the app's input field. Without a key, the app loads demo data for the 2023/24 season automatically.

## 🧩 Features

- **Season Selector** — Dropdown to choose from the last 10 EPL seasons
- **Custom League Table** — Reverse strength scoring with dynamic re-ranking after every match
- **Official Table** — Real EPL standings displayed side-by-side for comparison
- **Color-coded rows** — Champions League (blue), Europa (orange), Relegation (red)
- **Loading & error states** — Graceful handling of API failures and rate limits

## 🏗️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** TailwindCSS
- **Data fetching:** Axios
- **Tests:** Vitest + Testing Library

## 🧪 Running Tests

```bash
npm test
```

Tests cover the scoring logic and match processing engine including edge cases for draws, first match of season, and mid-season position updates.

## 📁 Project Structure

```
src/
  components/   # SeasonSelector, CustomTable, OfficialTable, LoadingSpinner, ErrorMessage
  hooks/        # useLeague — main state management hook
  services/     # api.js (football-data.org), mockData.js (demo data)
  utils/        # scoring.js (reverse strength formula), tableProcessor.js (match engine)
  pages/        # Dashboard.jsx
  __tests__/    # Unit tests
```

