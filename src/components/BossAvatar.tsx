import { motion } from 'framer-motion';

interface BossAvatarProps {
  paper: string;
  defeated: boolean;
  size?: number;
}

// Each boss has a unique SVG illustration themed to their math domain
export default function BossAvatar({ paper, defeated, size = 48 }: BossAvatarProps) {
  const s = size;
  const opacity = defeated ? 0.5 : 1;

  const avatars: Record<string, React.ReactNode> = {
    // Pure 1 — The Algebraic Sentinel: crystal/gem shape with algebra symbols
    'Pure 1': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" opacity={opacity}>
        <defs>
          <linearGradient id="pure1-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>
        {/* Crystal shape */}
        <motion.path
          d="M24 4L38 18L24 44L10 18Z"
          fill="url(#pure1-grad)"
          animate={defeated ? {} : { filter: ['drop-shadow(0 0 4px #7C3AED)', 'drop-shadow(0 0 8px #7C3AED)', 'drop-shadow(0 0 4px #7C3AED)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <path d="M24 4L38 18L24 22L10 18Z" fill="#A78BFA" opacity={0.4} />
        {/* x symbol */}
        <text x="24" y="28" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white" fontFamily="monospace">x</text>
      </svg>
    ),

    // Pure 2 — The Calculus Warden: integral/wave shape
    'Pure 2': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" opacity={opacity}>
        <defs>
          <linearGradient id="pure2-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>
        {/* Orb */}
        <circle cx="24" cy="24" r="18" fill="url(#pure2-grad)" />
        <motion.circle
          cx="24" cy="24" r="18"
          stroke="#A5B4FC" strokeWidth="1.5" fill="none"
          animate={defeated ? {} : { r: [18, 20, 18], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        {/* Integral symbol */}
        <text x="24" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white" fontFamily="serif">∫</text>
      </svg>
    ),

    // Stats 1 — The Probability Phantom: dice/probability themed
    'Stats 1': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" opacity={opacity}>
        <defs>
          <linearGradient id="stats1-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
        {/* Tilted dice shape */}
        <motion.rect
          x="10" y="10" width="28" height="28" rx="5"
          fill="url(#stats1-grad)"
          animate={defeated ? {} : { rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transformOrigin: '24px 24px' }}
        />
        {/* Dice dots */}
        <circle cx="17" cy="17" r="2.5" fill="white" opacity={0.9} />
        <circle cx="31" cy="17" r="2.5" fill="white" opacity={0.9} />
        <circle cx="24" cy="24" r="2.5" fill="white" opacity={0.9} />
        <circle cx="17" cy="31" r="2.5" fill="white" opacity={0.9} />
        <circle cx="31" cy="31" r="2.5" fill="white" opacity={0.9} />
      </svg>
    ),

    // Stats 2 — The Distribution Dragon: bell curve dragon
    'Stats 2': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" opacity={opacity}>
        <defs>
          <linearGradient id="stats2-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#F87171" />
          </linearGradient>
        </defs>
        {/* Dragon head shape */}
        <motion.path
          d="M24 6C14 6 8 16 8 24C8 36 18 42 24 42C30 42 40 36 40 24C40 16 34 6 24 6Z"
          fill="url(#stats2-grad)"
          animate={defeated ? {} : { scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '24px 24px' }}
        />
        {/* Eyes */}
        <circle cx="18" cy="22" r="3" fill="#FEF08A" />
        <circle cx="30" cy="22" r="3" fill="#FEF08A" />
        <circle cx="18" cy="22" r="1.5" fill="#1a1a2e" />
        <circle cx="30" cy="22" r="1.5" fill="#1a1a2e" />
        {/* Horns */}
        <path d="M14 14L10 4L18 12Z" fill="#FCA5A5" />
        <path d="M34 14L38 4L30 12Z" fill="#FCA5A5" />
        {/* Bell curve on forehead */}
        <path d="M16 32 Q20 26 24 26 Q28 26 32 32" stroke="white" strokeWidth="2" fill="none" opacity={0.7} />
      </svg>
    ),

    // Decision 1 — The Algorithm Architect: network/graph shape
    'Decision 1': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" opacity={opacity}>
        <defs>
          <linearGradient id="dec1-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
        {/* Hexagonal shape */}
        <motion.path
          d="M24 4L42 14V34L24 44L6 34V14Z"
          fill="url(#dec1-grad)"
          animate={defeated ? {} : { filter: ['drop-shadow(0 0 3px #059669)', 'drop-shadow(0 0 7px #059669)', 'drop-shadow(0 0 3px #059669)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Network nodes */}
        <circle cx="24" cy="18" r="3" fill="white" />
        <circle cx="16" cy="30" r="3" fill="white" />
        <circle cx="32" cy="30" r="3" fill="white" />
        {/* Edges */}
        <line x1="24" y1="18" x2="16" y2="30" stroke="white" strokeWidth="1.5" opacity={0.7} />
        <line x1="24" y1="18" x2="32" y2="30" stroke="white" strokeWidth="1.5" opacity={0.7} />
        <line x1="16" y1="30" x2="32" y2="30" stroke="white" strokeWidth="1.5" opacity={0.7} />
      </svg>
    ),

    // Further Pure 1 — The Matrix Master: matrix/grid themed
    'Further Pure 1': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" opacity={opacity}>
        <defs>
          <linearGradient id="fp1-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#7E22CE" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
        </defs>
        {/* Rounded square */}
        <rect x="6" y="6" width="36" height="36" rx="8" fill="url(#fp1-grad)" />
        {/* Matrix brackets */}
        <path d="M12 12V36" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 36H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 12V36" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 12H32" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 36H32" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Matrix values */}
        <motion.g
          animate={defeated ? {} : { opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <text x="20" y="22" textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace">1</text>
          <text x="28" y="22" textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace">0</text>
          <text x="20" y="34" textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace">0</text>
          <text x="28" y="34" textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace">1</text>
        </motion.g>
      </svg>
    ),
  };

  const avatar = avatars[paper];
  if (!avatar) return null;

  return (
    <motion.div
      className="flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      whileHover={defeated ? {} : { scale: 1.1 }}
    >
      {avatar}
    </motion.div>
  );
}
