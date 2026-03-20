import { motion } from 'framer-motion';

interface HPBarProps {
  current: number;
  max: number;
  showNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
  shaking?: boolean;
  className?: string;
}

export default function HPBar({ current, max, showNumbers = true, size = 'md', shaking = false, className = '' }: HPBarProps) {
  const pct = max > 0 ? ((max - current) / max) * 100 : 0;
  const hpPct = max > 0 ? (current / max) * 100 : 0;

  const heights = { sm: 'h-2', md: 'h-4', lg: 'h-6' };
  const height = heights[size];

  // Color based on remaining HP
  const getBarColor = () => {
    if (hpPct > 60) return 'bg-boss';
    if (hpPct > 30) return 'bg-xp';
    if (hpPct > 0) return 'bg-complete';
    return 'bg-complete';
  };

  // Glow based on remaining HP
  const getGlow = () => {
    if (hpPct > 60) return 'shadow-[0_0_12px_#EF444440]';
    if (hpPct > 30) return 'shadow-[0_0_12px_#F59E0B40]';
    return 'shadow-[0_0_12px_#22C55E40]';
  };

  return (
    <div className={`${className} ${shaking ? 'animate-shake' : ''}`}>
      {showNumbers && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-mono text-text-secondary">
            {current} / {max} HP
          </span>
          <span className="text-xs font-mono text-text-muted">
            {pct.toFixed(0)}% DMG
          </span>
        </div>
      )}
      <div className={`${height} bg-bg-dark rounded-full overflow-hidden ${getGlow()}`}>
        <motion.div
          className={`h-full rounded-full ${getBarColor()} relative`}
          initial={{ width: '100%' }}
          animate={{ width: `${hpPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {size === 'lg' && hpPct > 0 && (
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
