import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Target, Skull, Flame, TrendingUp, Calendar } from 'lucide-react';
import { format, parseISO, differenceInDays, addDays } from 'date-fns';
import { useGame } from '../context/GameContext';
import ProgressRing from '../components/ProgressRing';
import XPCounter from '../components/XPCounter';
import { BOSS_CONFIGS, CAMPAIGN_DAYS } from '../data/types';

const paperColors: Record<string, string> = {
  'Pure 1': '#8B5CF6',
  'Pure 2': '#6366F1',
  'Stats 1': '#3B82F6',
  'Stats 2': '#EF4444',
  'Decision 1': '#22C55E',
  'Further Pure 1': '#A855F7',
};

export default function Stats() {
  const { state, getStreak } = useGame();
  const streak = getStreak();

  const stats = useMemo(() => {
    const totalTopics = state.topics.length;
    const completedTopics = state.topics.filter(t => t.studyStatus === 'completed').length;
    const bossesDefeated = state.bosses.filter(b => b.defeated).length;
    const daysElapsed = differenceInDays(new Date(), parseISO(state.campaignStartDate)) + 1;
    const daysRemaining = Math.max(0, CAMPAIGN_DAYS - daysElapsed);

    const cTopics = state.topics.filter(t => t.originalStatus === 'C');
    const rTopics = state.topics.filter(t => t.originalStatus === 'R');
    const pTopics = state.topics.filter(t => t.originalStatus === 'P');

    const cCompleted = cTopics.filter(t => t.studyStatus === 'completed').length;
    const rCompleted = rTopics.filter(t => t.studyStatus === 'completed').length;
    const pCompleted = pTopics.filter(t => t.studyStatus === 'completed').length;

    // Daily XP data
    const dailyXP: { date: string; xp: number }[] = [];
    const startDate = parseISO(state.campaignStartDate);
    for (let i = 0; i < Math.min(CAMPAIGN_DAYS, daysElapsed); i++) {
      const d = format(addDays(startDate, i), 'yyyy-MM-dd');
      const log = state.dayLogs.find(l => l.date === d);
      dailyXP.push({ date: d, xp: log?.xpEarned || 0 });
    }

    // Personal bests
    const maxDailyXP = state.dayLogs.reduce((max, d) => Math.max(max, d.xpEarned), 0);
    const maxDailyTopics = state.dayLogs.reduce((max, d) => Math.max(max, d.topicsCompleted.length), 0);

    // Average XP per active day
    const activeDays = state.dayLogs.filter(d => d.xpEarned > 0).length;
    const avgXP = activeDays > 0 ? Math.round(state.totalXP / activeDays) : 0;

    // Projection
    const topicsPerDay = activeDays > 0 ? completedTopics / activeDays : 0;
    const remainingTopics = totalTopics - completedTopics;
    const daysToComplete = topicsPerDay > 0 ? Math.ceil(remainingTopics / topicsPerDay) : Infinity;
    const willFinish = daysToComplete <= daysRemaining;

    // Paper progress
    const paperProgress = BOSS_CONFIGS.map(b => {
      const paperTopics = state.topics.filter(t => t.paper === b.paper);
      const done = paperTopics.filter(t => t.studyStatus === 'completed').length;
      return {
        paper: b.paper,
        title: b.title,
        progress: paperTopics.length > 0 ? done / paperTopics.length : 0,
        done,
        total: paperTopics.length,
        color: paperColors[b.paper] || '#8B5CF6',
      };
    });

    return {
      totalTopics, completedTopics, bossesDefeated, daysElapsed, daysRemaining,
      cTopics: cTopics.length, rTopics: rTopics.length, pTopics: pTopics.length,
      cCompleted, rCompleted, pCompleted,
      dailyXP, maxDailyXP, maxDailyTopics, avgXP,
      topicsPerDay, daysToComplete, willFinish, paperProgress,
    };
  }, [state]);

  const maxBarXP = Math.max(...stats.dailyXP.map(d => d.xp), 1);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-xp" />
          <span className="text-xs font-display font-bold text-xp uppercase tracking-widest">War Room</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">Campaign Analytics</h1>
      </motion.div>

      {/* Top Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        {[
          { icon: Target, label: 'Topics Conquered', value: `${stats.completedTopics}/${stats.totalTopics}`, color: 'text-primary-light' },
          { icon: Skull, label: 'Bosses Defeated', value: `${stats.bossesDefeated}/6`, color: 'text-boss-light' },
          { icon: Calendar, label: 'Days Remaining', value: stats.daysRemaining, color: 'text-xp' },
          { icon: Flame, label: 'Current Streak', value: `${streak}d`, color: 'text-boss-light' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="bg-bg-card rounded-lg border border-border p-4"
          >
            <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
            <div className={`font-mono text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] font-heading text-text-muted uppercase tracking-wider mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Total XP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-bg-card rounded-xl border border-border p-5 mb-6"
      >
        <XPCounter value={state.totalXP} label="Total Campaign XP" size="lg" />
      </motion.div>

      {/* Paper Progress Rings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-bg-card rounded-xl border border-border p-5 mb-6"
      >
        <h3 className="font-heading font-semibold text-sm text-text-secondary mb-5 uppercase tracking-wider">Paper Progress</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {stats.paperProgress.map((p, i) => (
            <motion.div
              key={p.paper}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <ProgressRing
                progress={p.progress}
                size={90}
                strokeWidth={6}
                color={p.color}
                label={p.paper}
                sublabel={`${p.done}/${p.total}`}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily XP Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-bg-card rounded-xl border border-border p-5"
        >
          <h3 className="font-heading font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">Daily XP</h3>
          <div className="flex items-end gap-1 h-32">
            {stats.dailyXP.map((day, i) => {
              const height = maxBarXP > 0 ? (day.xp / maxBarXP) * 100 : 0;
              return (
                <motion.div
                  key={day.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 2)}%` }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                  className="flex-1 rounded-t relative group cursor-pointer"
                  style={{
                    backgroundColor: day.xp > 0 ? '#8B5CF6' : '#1F2937',
                    minWidth: 8,
                  }}
                >
                  {/* Tooltip */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10">
                    <div className="bg-bg-dark border border-border rounded px-2 py-1 text-[10px] font-mono text-text-secondary whitespace-nowrap shadow-lg">
                      <div>{format(parseISO(day.date), 'dd MMM')}</div>
                      <div className="text-xp font-bold">{day.xp} XP</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-mono text-text-muted">
              {stats.dailyXP.length > 0 ? format(parseISO(stats.dailyXP[0].date), 'dd MMM') : ''}
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              {stats.dailyXP.length > 0 ? format(parseISO(stats.dailyXP[stats.dailyXP.length - 1].date), 'dd MMM') : ''}
            </span>
          </div>
        </motion.div>

        {/* Topic Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-card rounded-xl border border-border p-5"
        >
          <h3 className="font-heading font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">Topic Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Learn (C)', total: stats.cTopics, done: stats.cCompleted, color: 'bg-boss', textColor: 'text-boss-light', xp: 30 },
              { label: 'Review (R)', total: stats.rTopics, done: stats.rCompleted, color: 'bg-xp', textColor: 'text-xp', xp: 15 },
              { label: 'Practice (P)', total: stats.pTopics, done: stats.pCompleted, color: 'bg-complete', textColor: 'text-complete', xp: 5 },
            ].map(cat => (
              <div key={cat.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`font-heading font-semibold ${cat.textColor}`}>{cat.label} ({cat.xp} XP each)</span>
                  <span className="font-mono text-text-muted">{cat.done}/{cat.total}</span>
                </div>
                <div className="h-3 bg-bg-deep rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${cat.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.total > 0 ? (cat.done / cat.total) * 100 : 0}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Bests */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-bg-card rounded-xl border border-border p-5"
        >
          <h3 className="font-heading font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">Personal Bests</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Most XP in a day', value: stats.maxDailyXP, suffix: ' XP' },
              { label: 'Most topics in a day', value: stats.maxDailyTopics, suffix: '' },
              { label: 'Longest streak', value: streak, suffix: 'd' },
              { label: 'Avg XP per day', value: stats.avgXP, suffix: ' XP' },
            ].map(pb => (
              <div key={pb.label} className="bg-bg-deep rounded-lg p-3">
                <div className="font-mono text-lg font-bold text-xp">{pb.value}{pb.suffix}</div>
                <div className="text-[10px] font-heading text-text-muted uppercase">{pb.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className={`bg-bg-card rounded-xl border p-5 ${stats.willFinish ? 'border-complete/30' : 'border-xp/30'}`}
        >
          <h3 className="font-heading font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">Projected Completion</h3>
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className={`w-8 h-8 ${stats.willFinish ? 'text-complete' : 'text-xp'}`} />
            <div>
              <div className={`font-mono text-2xl font-bold ${stats.willFinish ? 'text-complete' : 'text-xp'}`}>
                {stats.topicsPerDay > 0
                  ? `${stats.daysToComplete} days`
                  : 'No data yet'
                }
              </div>
              <div className="text-xs font-heading text-text-muted">
                at current pace ({stats.topicsPerDay.toFixed(1)} topics/day)
              </div>
            </div>
          </div>

          {stats.topicsPerDay > 0 && (
            <div className={`p-3 rounded-lg ${stats.willFinish ? 'bg-complete/10 border border-complete/20' : 'bg-xp/10 border border-xp/20'}`}>
              <span className={`text-sm font-heading font-semibold ${stats.willFinish ? 'text-complete' : 'text-xp'}`}>
                {stats.willFinish
                  ? 'On track to finish before exams.'
                  : `Need to increase pace. ${stats.daysRemaining} days left, ${stats.totalTopics - stats.completedTopics} topics remaining.`
                }
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
