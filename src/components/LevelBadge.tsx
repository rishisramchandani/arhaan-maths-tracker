import { motion } from 'framer-motion';
import { XP_PER_LEVEL } from '../data/types';

interface LevelBadgeProps {
  level: number;
  totalXP: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function LevelBadge({ level, totalXP, size = 'md' }: LevelBadgeProps) {
  const xpInLevel = totalXP % XP_PER_LEVEL;
  const progress = xpInLevel / XP_PER_LEVEL;

  const sizes = {
    sm: { outer: 48, inner: 40, stroke: 3, text: 'text-sm' },
    md: { outer: 64, inner: 54, stroke: 4, text: 'text-xl' },
    lg: { outer: 80, inner: 68, stroke: 5, text: 'text-2xl' },
  };
  const s = sizes[size];
  const radius = (s.outer - s.stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: s.outer, height: s.outer }}>
      <svg width={s.outer} height={s.outer} className="absolute -rotate-90">
        <circle
          cx={s.outer / 2}
          cy={s.outer / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={s.stroke}
          fill="none"
        />
        <motion.circle
          cx={s.outer / 2}
          cy={s.outer / 2}
          r={radius}
          stroke="#8B5CF6"
          strokeWidth={s.stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 6px #8B5CF680)' }}
        />
      </svg>
      <div className={`relative z-10 font-display font-bold text-primary ${s.text}`}>
        {level}
      </div>
    </div>
  );
}
