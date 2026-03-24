import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    // Let exit animation finish before unmounting
    setTimeout(onComplete, 600);
  }, [onComplete]);

  // Auto-dismiss after 2.8 s
  useEffect(() => {
    const timer = setTimeout(handleDismiss, 2800);
    return () => clearTimeout(timer);
  }, [handleDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900 cursor-pointer select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleDismiss}
        >
          {/* Subtle background pulse ring */}
          <motion.div
            className="absolute w-[32rem] h-[32rem] rounded-full border border-blue-500/20"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full border border-purple-500/20"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative flex flex-col items-center gap-5 px-6 text-center">
            {/* Logo / Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-6xl"
            >
              ⚡
            </motion.div>

            {/* App name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white"
            >
              Reverse Table
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
              className="text-xl sm:text-2xl font-medium text-yellow-400"
            >
              What if the Premier League rewarded underdogs?
            </motion.p>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-blue-300 text-sm sm:text-base max-w-md"
            >
              A new way to calculate football standings based on opponent strength
            </motion.p>

            {/* Loading indicator dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex gap-1.5 mt-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-blue-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>

            {/* Tap-to-skip hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.8 }}
              className="text-blue-400 text-xs mt-4"
            >
              Tap anywhere to continue
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
