import { motion } from 'framer-motion';
import { Skull } from 'lucide-react';
import { useGame } from '../context/GameContext';
import BossCard from '../components/BossCard';

export default function BossList() {
  const { state } = useGame();
  const defeated = state.bosses.filter(b => b.defeated).length;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Skull className="w-4 h-4 text-boss" />
          <span className="text-xs font-display font-bold text-boss uppercase tracking-widest">Boss Roster</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
          6 Papers. 6 Bosses.
        </h1>
        <p className="text-sm text-text-secondary mt-2 font-body">
          {defeated}/6 defeated. Each boss falls when all its topics are conquered.
        </p>
      </motion.div>

      {/* Boss Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.bosses.map((boss, i) => (
          <BossCard key={boss.paper} boss={boss} index={i} />
        ))}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-bg-card rounded-lg border border-border"
      >
        <h3 className="font-heading font-semibold text-sm text-text-secondary mb-3 uppercase tracking-wider">Difficulty Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-boss" />
            <span className="text-xs font-mono text-text-secondary">C (Learn from scratch) = 30 XP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-xp" />
            <span className="text-xs font-mono text-text-secondary">R (Review needed) = 15 XP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-complete" />
            <span className="text-xs font-mono text-text-secondary">P (Practice only) = 5 XP</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
