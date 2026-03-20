import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import HPBar from './HPBar';
import BossAvatar from './BossAvatar';
import type { Boss } from '../data/types';
import { useGame } from '../context/GameContext';

interface BossCardProps {
  boss: Boss;
  index: number;
}

const bossGradients: Record<string, string> = {
  'Pure 1': 'from-violet-900/40 to-transparent',
  'Pure 2': 'from-indigo-900/40 to-transparent',
  'Stats 1': 'from-blue-900/40 to-transparent',
  'Stats 2': 'from-red-900/40 to-transparent',
  'Decision 1': 'from-emerald-900/40 to-transparent',
  'Further Pure 1': 'from-purple-900/40 to-transparent',
};

export default function BossCard({ boss, index }: BossCardProps) {
  const { getTopicsForPaper } = useGame();
  const topics = getTopicsForPaper(boss.paper);
  const completed = topics.filter(t => t.studyStatus === 'completed').length;
  const total = topics.length;

  const paperSlug = boss.paper.replace(/\s+/g, '-').toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/boss/${paperSlug}`} className="block group">
        <div className={`
          relative rounded-xl border overflow-hidden transition-all duration-300
          ${boss.defeated
            ? 'border-complete/30 bg-complete/5'
            : 'border-border hover:border-primary/50 bg-bg-card hover:bg-bg-card-hover'
          }
        `}>
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${bossGradients[boss.paper] || 'from-gray-900/40 to-transparent'} opacity-50`} />

          <div className="relative p-4 lg:p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <BossAvatar paper={boss.paper} defeated={boss.defeated} size={40} />
                <div>
                  <h3 className="font-heading font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                    {boss.paper}
                  </h3>
                  <p className="font-heading text-xs text-text-muted italic">
                    {boss.title}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors mt-1" />
            </div>

            {/* HP Bar */}
            <HPBar current={boss.currentHP} max={boss.maxHP} size="sm" showNumbers={false} />

            {/* Stats */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs font-mono text-text-secondary">
                {completed}/{total} topics
              </span>
              {boss.defeated ? (
                <span className="text-[10px] font-display font-bold text-complete uppercase tracking-wider">
                  DEFEATED
                </span>
              ) : (
                <span className="text-xs font-mono text-boss-light">
                  {boss.currentHP} HP left
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
