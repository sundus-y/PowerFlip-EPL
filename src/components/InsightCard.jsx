import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function InsightCard({ emoji, label, team, stat, description, color, index }) {
  const borderColor = {
    green: 'border-green-500/40 hover:border-green-400',
    red: 'border-red-500/40 hover:border-red-400',
    yellow: 'border-yellow-500/40 hover:border-yellow-400',
    blue: 'border-blue-500/40 hover:border-blue-400',
  }[color] ?? 'border-white/10 hover:border-white/30';

  const statColor = {
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
  }[color] ?? 'text-white';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-gray-800/60 backdrop-blur-sm border ${borderColor} rounded-2xl p-5 shadow-lg transition-colors duration-200 flex flex-col gap-3`}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl leading-none">{emoji}</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </span>
      </div>

      {/* Team */}
      <div className="flex items-center gap-3">
        {team?.crest && (
          <img
            src={team.crest}
            alt={team.shortName}
            className="w-9 h-9 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <span className="text-lg font-bold text-white leading-tight">
          {team?.shortName ?? team?.name ?? '—'}
        </span>
      </div>

      {/* Stat */}
      {stat && (
        <p className={`text-2xl font-extrabold ${statColor}`}>{stat}</p>
      )}

      {/* Description */}
      {description && (
        <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
