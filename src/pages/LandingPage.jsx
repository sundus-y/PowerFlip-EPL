import { motion } from 'framer-motion';
import InsightCard from '../components/InsightCard';
import { computeInsights } from '../utils/insights';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LandingPage({ customTable, realTable, matches, loading, onExplore }) {
  const insights = computeInsights(customTable, realTable, matches);

  const cards = buildCards(insights);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl mb-6"
          >
            ⚡
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5"
          >
            A New Way to Rank
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              the Premier League
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl sm:text-2xl text-yellow-400 font-semibold mb-4"
          >
            Stronger opponents = bigger rewards
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-10"
          >
            Forget equal points for every win. In PowerFlip EPL, defeating a top-ranked
            side earns far more than beating a struggling club.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg shadow-lg shadow-blue-900/40 transition-all duration-200"
          >
            Explore Season
            <span className="text-xl">→</span>
          </motion.button>
        </div>
      </section>

      {/* Insight Cards Section */}
      <section className="px-6 pb-16 max-w-6xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 mb-8"
        >
          2023/24 Season Highlights
        </motion.h2>

        {loading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {!loading && insights && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, i) => (
              <InsightCard key={card.label} {...card} index={i} />
            ))}
          </div>
        )}

        {!loading && !insights && (
          <p className="text-center text-gray-600 text-sm">
            No insight data available yet.
          </p>
        )}
      </section>

      {/* Footer note */}
      <footer className="text-center text-gray-700 text-xs pb-6">
        Based on 2023/24 EPL data · Demo mode
      </footer>
    </div>
  );
}

function buildCards(insights) {
  if (!insights) return [];

  const { biggestBeneficiary, mostPenalized, upsetKing, reverseChampion } = insights;

  return [
    {
      emoji: '🟢',
      label: 'Biggest Beneficiary',
      team: biggestBeneficiary,
      stat: biggestBeneficiary?.diff != null ? `+${biggestBeneficiary.diff} places` : '—',
      description: biggestBeneficiary
        ? `Rose from ${ordinal(biggestBeneficiary.realPos)} to ${ordinal(biggestBeneficiary.reversePos)} in the reverse table`
        : 'No data',
      color: 'green',
    },
    {
      emoji: '🔴',
      label: 'Most Penalized',
      team: mostPenalized,
      stat: mostPenalized?.diff != null ? `${mostPenalized.diff} places` : '—',
      description: mostPenalized
        ? `Fell from ${ordinal(mostPenalized.realPos)} to ${ordinal(mostPenalized.reversePos)} in the reverse table`
        : 'No data',
      color: 'red',
    },
    {
      emoji: '⚡',
      label: 'Upset King',
      team: upsetKing,
      stat: upsetKing?.upsetWins != null ? `${upsetKing.upsetWins} upsets` : '—',
      description: upsetKing
        ? `Most wins against higher-ranked opponents`
        : 'No data',
      color: 'yellow',
    },
    {
      emoji: '🏆',
      label: 'Reverse Champion',
      team: reverseChampion,
      stat: reverseChampion ? '#1' : '—',
      description: reverseChampion
        ? `Winner under the reverse strength scoring system`
        : 'No data',
      color: 'blue',
    },
  ];
}

function ordinal(n) {
  if (n == null) return '?';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
