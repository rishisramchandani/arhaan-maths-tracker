import { useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Skull, Shield, Swords } from 'lucide-react';
import { useGame } from '../context/GameContext';
import HPBar from '../components/HPBar';
import BossAvatar from '../components/BossAvatar';
import TopicRow from '../components/TopicRow';
import MilestoneToast from '../components/MilestoneToast';
import { BOSS_CONFIGS } from '../data/types';

const paperFromSlug: Record<string, string> = {
  'pure-1': 'Pure 1',
  'pure-2': 'Pure 2',
  'stats-1': 'Stats 1',
  'stats-2': 'Stats 2',
  'decision-1': 'Decision 1',
  'further-pure-1': 'Further Pure 1',
};

export default function BossDetail() {
  const { paper: paperSlug } = useParams<{ paper: string }>();
  const paperName = paperFromSlug[paperSlug || ''] || '';
  const { getTopicsForPaper, getBoss } = useGame();

  const boss = getBoss(paperName);
  const topics = getTopicsForPaper(paperName);
  const bossConfig = BOSS_CONFIGS.find(b => b.paper === paperName);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'boss_defeated' | 'level_up' | 'milestone' | 'first_blood' }>({ show: false, message: '', type: 'milestone' });
  const [shaking, setShaking] = useState(false);

  const chapters = useMemo(() => {
    const chapterMap = new Map<string, typeof topics>();
    topics.forEach(t => {
      if (!chapterMap.has(t.chapter)) {
        chapterMap.set(t.chapter, []);
      }
      chapterMap.get(t.chapter)!.push(t);
    });
    return Array.from(chapterMap.entries());
  }, [topics]);

  const handleMilestone = useCallback((message: string, type: 'boss_defeated' | 'level_up' | 'milestone' | 'first_blood') => {
    setToast({ show: true, message, type });
    if (type === 'boss_defeated') {
      setShaking(true);
      setTimeout(() => setShaking(false), 1000);
    }
  }, []);

  // Trigger shake on any topic complete
  const handleTopicMilestone = useCallback((message: string, type: 'boss_defeated' | 'level_up' | 'milestone' | 'first_blood') => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
    handleMilestone(message, type);
  }, [handleMilestone]);

  if (!boss || !bossConfig) {
    return (
      <div className="p-8 text-center">
        <p className="text-text-secondary">Boss not found.</p>
        <Link to="/" className="text-primary text-sm mt-4 inline-block">Back to HQ</Link>
      </div>
    );
  }

  const completed = topics.filter(t => t.studyStatus === 'completed').length;
  const total = topics.length;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <MilestoneToast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />

      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Campaign HQ
      </Link>

      {/* Boss Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-xl border overflow-hidden mb-8 ${boss.defeated ? 'border-complete/30' : 'border-border'}`}
      >
        {/* Background */}
        <div className={`absolute inset-0 ${boss.defeated ? 'bg-complete/5' : 'bg-gradient-to-br from-boss/10 via-bg-card to-bg-card'}`} />

        <div className="relative p-6 md:p-8">
          <div className="flex items-start gap-5 mb-6">
            <BossAvatar paper={boss.paper} defeated={boss.defeated} size={64} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-display font-bold text-text-muted uppercase tracking-widest">{boss.paper}</span>
                {boss.defeated && (
                  <motion.span
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="px-2 py-0.5 rounded bg-complete/20 border border-complete/30 text-[10px] font-display font-bold text-complete uppercase tracking-wider"
                  >
                    DEFEATED
                  </motion.span>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
                {bossConfig.title}
              </h1>
              <p className="text-sm font-mono text-text-secondary mt-1">
                {completed}/{total} topics conquered
              </p>
            </div>
          </div>

          {/* HP Bar */}
          <HPBar current={boss.currentHP} max={boss.maxHP} size="lg" shaking={shaking} />

          {/* Quick Stats */}
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Skull className="w-4 h-4 text-boss-light" />
              <span className="text-xs font-mono text-text-secondary">
                {topics.filter(t => t.originalStatus === 'C').length} to learn
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-xp" />
              <span className="text-xs font-mono text-text-secondary">
                {topics.filter(t => t.originalStatus === 'R').length} to review
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-complete" />
              <span className="text-xs font-mono text-text-secondary">
                {topics.filter(t => t.originalStatus === 'P').length} to practise
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chapters */}
      <div className="space-y-6">
        {chapters.map(([chapter, chapterTopics], chapterIdx) => {
          const chCompleted = chapterTopics.filter(t => t.studyStatus === 'completed').length;
          const chTotal = chapterTopics.length;
          const chPct = chTotal > 0 ? (chCompleted / chTotal) * 100 : 0;

          return (
            <motion.div
              key={chapter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chapterIdx * 0.05 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-sm text-text-primary">{chapter}</h3>
                <span className="text-xs font-mono text-text-muted">{chCompleted}/{chTotal}</span>
              </div>

              {/* Chapter progress bar */}
              <div className="h-1.5 bg-bg-dark rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${chPct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: chapterIdx * 0.05 + 0.2 }}
                />
              </div>

              <div className="space-y-2">
                {chapterTopics.map(topic => (
                  <TopicRow key={topic.id} topic={topic} onMilestone={handleTopicMilestone} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
