import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Target, Timer, Zap, ChevronRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import BossCard from '../components/BossCard';
import LevelBadge from '../components/LevelBadge';
import XPCounter from '../components/XPCounter';
import CampaignGrid from '../components/CampaignGrid';
import MilestoneToast from '../components/MilestoneToast';
import { XP_PER_LEVEL } from '../data/types';

export default function Dashboard() {
  const { state, getTodayLog, getStreak } = useGame();
  const todayLog = getTodayLog();
  const streak = getStreak();

  const [toast, setToast] = useState({ show: false, message: '', type: 'milestone' as const });

  const totalCompleted = state.topics.filter(t => t.studyStatus === 'completed').length;
  const totalTopics = state.topics.length;
  const bossesDefeated = state.bosses.filter(b => b.defeated).length;

  const xpInLevel = state.totalXP % XP_PER_LEVEL;
  const xpToNext = XP_PER_LEVEL - xpInLevel;

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full overflow-hidden">
      <MilestoneToast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-display font-bold text-primary uppercase tracking-widest">Campaign HQ</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
          The Maths Campaign
        </h1>
      </motion.div>

      {/* Level + XP Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-bg-card rounded-xl border border-border p-5 mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <LevelBadge level={state.level} totalXP={state.totalXP} size="lg" />
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-1">
              <XPCounter value={state.totalXP} label="Total XP" size="lg" />
            </div>
            <p className="text-xs font-mono text-text-muted">
              {xpToNext} XP to Level {state.level + 1}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-right">
            <div>
              <span className="block font-mono text-lg font-bold text-text-primary">{totalCompleted}</span>
              <span className="text-[10px] font-heading text-text-muted uppercase">Topics</span>
            </div>
            <div>
              <span className="block font-mono text-lg font-bold text-text-primary">{bossesDefeated}/6</span>
              <span className="text-[10px] font-heading text-text-muted uppercase">Bosses</span>
            </div>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="h-2 bg-bg-deep rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(xpInLevel / XP_PER_LEVEL) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ boxShadow: '0 0 10px #8B5CF680' }}
          />
        </div>
      </motion.div>

      {/* Today's Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        {[
          { icon: Zap, label: 'XP Today', value: todayLog.xpEarned, color: 'text-xp' },
          { icon: Target, label: 'Topics Today', value: todayLog.topicsCompleted.length, color: 'text-primary-light' },
          { icon: Timer, label: 'Focus Sessions', value: todayLog.focusSessions, color: 'text-complete' },
          { icon: Flame, label: 'Streak', value: `${streak}d`, color: 'text-boss-light' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="bg-bg-card rounded-lg border border-border p-4"
          >
            <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
            <div className={`font-mono text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] font-heading text-text-muted uppercase tracking-wider mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Boss Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg text-text-primary">Bosses</h2>
          <Link to="/bosses" className="flex items-center gap-1 text-xs font-heading text-primary hover:text-primary-light transition-colors">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {state.bosses.map((boss, i) => (
            <BossCard key={boss.paper} boss={boss} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Campaign Grid + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-bg-card rounded-xl border border-border p-5"
        >
          <CampaignGrid />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-card rounded-xl border border-border p-5"
        >
          <h3 className="font-heading font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/focus"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group"
            >
              <Timer className="w-5 h-5 text-primary" />
              <div>
                <span className="text-sm font-heading font-semibold text-primary">Start Focus Session</span>
                <p className="text-[10px] text-text-muted">25 min timer + 10 XP</p>
              </div>
              <ChevronRight className="w-4 h-4 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              to="/stats"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-xp/10 border border-xp/20 hover:bg-xp/20 transition-all group"
            >
              <Target className="w-5 h-5 text-xp" />
              <div>
                <span className="text-sm font-heading font-semibold text-xp">View War Room</span>
                <p className="text-[10px] text-text-muted">Analytics & projections</p>
              </div>
              <ChevronRight className="w-4 h-4 text-xp ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              to="/tree"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-complete/10 border border-complete/20 hover:bg-complete/20 transition-all group"
            >
              <Flame className="w-5 h-5 text-complete" />
              <div>
                <span className="text-sm font-heading font-semibold text-complete">Skill Map</span>
                <p className="text-[10px] text-text-muted">Visualise your conquest</p>
              </div>
              <ChevronRight className="w-4 h-4 text-complete ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Overall progress */}
          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex justify-between text-xs font-mono text-text-secondary mb-2">
              <span>Campaign Progress</span>
              <span>{totalCompleted}/{totalTopics}</span>
            </div>
            <div className="h-2 bg-bg-deep rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-complete-dark to-complete rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(totalCompleted / totalTopics) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
