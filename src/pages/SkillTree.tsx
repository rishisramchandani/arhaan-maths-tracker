import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map as MapIcon, ZoomIn, ZoomOut, Skull, Shield, Sword, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import MilestoneToast from '../components/MilestoneToast';
import { BOSS_CONFIGS } from '../data/types';
import type { Topic } from '../data/types';

const paperColors: Record<string, { main: string; glow: string; bg: string }> = {
  'Pure 1':         { main: '#8B5CF6', glow: '#8B5CF640', bg: '#8B5CF610' },
  'Pure 2':         { main: '#6366F1', glow: '#6366F140', bg: '#6366F110' },
  'Stats 1':        { main: '#3B82F6', glow: '#3B82F640', bg: '#3B82F610' },
  'Stats 2':        { main: '#EF4444', glow: '#EF444440', bg: '#EF444410' },
  'Decision 1':     { main: '#22C55E', glow: '#22C55E40', bg: '#22C55E10' },
  'Further Pure 1': { main: '#A855F7', glow: '#A855F740', bg: '#A855F710' },
};

function getNodeColor(topic: Topic): string {
  if (topic.studyStatus === 'completed') return '#22C55E';
  if (topic.originalStatus === 'C') return '#EF4444';
  if (topic.originalStatus === 'R') return '#F59E0B';
  return '#6B7280';
}

function getNodeGlow(topic: Topic): string {
  if (topic.studyStatus === 'completed') return '0 0 8px #22C55E60';
  if (topic.originalStatus === 'C') return '0 0 6px #EF444440';
  if (topic.originalStatus === 'R') return '0 0 6px #F59E0B40';
  return 'none';
}

export default function SkillTree() {
  const { state, completeTopic, getTopicsForPaper } = useGame();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [zoom, setZoom] = useState(1);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'boss_defeated' | 'level_up' | 'milestone' | 'first_blood' }>({ show: false, message: '', type: 'milestone' });

  const constellations = useMemo(() => {
    return BOSS_CONFIGS.map(config => {
      const topics = getTopicsForPaper(config.paper);
      const chapters: globalThis.Map<string, Topic[]> = new globalThis.Map();
      topics.forEach(t => {
        if (!chapters.has(t.chapter)) chapters.set(t.chapter, []);
        chapters.get(t.chapter)!.push(t);
      });
      return {
        ...config,
        chapters: Array.from(chapters.entries()) as [string, Topic[]][],
        topics,
        completed: topics.filter(t => t.studyStatus === 'completed').length,
        total: topics.length,
      };
    });
  }, [state.topics, getTopicsForPaper]);

  const handleNodeClick = useCallback((topic: Topic) => {
    if (topic.studyStatus === 'completed') {
      setSelectedTopic(topic);
      return;
    }
    setSelectedTopic(topic);
  }, []);

  const handleComplete = useCallback(() => {
    if (!selectedTopic || selectedTopic.studyStatus === 'completed') return;
    const result = completeTopic(selectedTopic.id);

    if (selectedTopic.originalStatus === 'C') {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 }, colors: ['#EF4444', '#8B5CF6'] });
    }

    if (result.bossDefeated) {
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 80, colors: ['#8B5CF6', '#22C55E', '#F59E0B'] });
        setToast({ show: true, message: `BOSS DEFEATED: ${selectedTopic.paper}!`, type: 'boss_defeated' });
      }, 300);
    }

    if (result.leveledUp) {
      setTimeout(() => {
        setToast({ show: true, message: `LEVEL UP! Level ${result.newLevel}`, type: 'level_up' });
      }, result.bossDefeated ? 3500 : 300);
    }

    setSelectedTopic(null);
  }, [selectedTopic, completeTopic]);

  const totalCompleted = state.topics.filter(t => t.studyStatus === 'completed').length;
  const totalTopics = state.topics.length;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <MilestoneToast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapIcon className="w-4 h-4 text-complete" />
              <span className="text-xs font-display font-bold text-complete uppercase tracking-widest">Skill Map</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">The Constellation</h1>
            <p className="text-sm text-text-secondary mt-1 font-mono">{totalCompleted}/{totalTopics} nodes lit</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="p-2 rounded-lg bg-bg-card border border-border hover:border-primary/30 text-text-secondary hover:text-primary transition-all"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-text-muted">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              className="p-2 rounded-lg bg-bg-card border border-border hover:border-primary/30 text-text-secondary hover:text-primary transition-all"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        {[
          { icon: Skull, label: 'Learn (C)', color: 'text-boss-light' },
          { icon: Shield, label: 'Review (R)', color: 'text-xp' },
          { icon: Sword, label: 'Practice (P)', color: 'text-text-muted' },
          { icon: Check, label: 'Completed', color: 'text-complete' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <item.icon className={`w-3 h-3 ${item.color}`} />
            <span className="text-[10px] font-mono text-text-secondary">{item.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Constellations Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-transform origin-top-left"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      >
        {constellations.map((constellation, ci) => {
          const colors = paperColors[constellation.paper];
          return (
            <motion.div
              key={constellation.paper}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.1 }}
              className="rounded-xl border border-border overflow-hidden"
              style={{ backgroundColor: colors.bg }}
            >
              {/* Constellation header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm" style={{ color: colors.main }}>
                      {constellation.paper}
                    </h3>
                    <p className="text-[10px] font-heading text-text-muted italic">{constellation.title}</p>
                  </div>
                  <span className="text-xs font-mono text-text-muted">
                    {constellation.completed}/{constellation.total}
                  </span>
                </div>
                {/* Mini progress */}
                <div className="h-1 bg-bg-deep rounded-full mt-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors.main }}
                    initial={{ width: 0 }}
                    animate={{ width: `${constellation.total > 0 ? (constellation.completed / constellation.total) * 100 : 0}%` }}
                    transition={{ duration: 0.8, delay: ci * 0.1 + 0.3 }}
                  />
                </div>
              </div>

              {/* Topic nodes */}
              <div className="p-3">
                {constellation.chapters.map(([chapter, chTopics], chIdx) => (
                  <div key={chapter} className="mb-3 last:mb-0">
                    <div className="text-[10px] font-heading text-text-muted mb-1.5 truncate" title={chapter}>
                      {chapter}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {chTopics.map((topic, ti) => {
                        const nodeColor = getNodeColor(topic);
                        const isSelected = selectedTopic?.id === topic.id;

                        return (
                          <motion.button
                            key={topic.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: ci * 0.1 + chIdx * 0.03 + ti * 0.02, type: 'spring', stiffness: 300 }}
                            whileHover={{ scale: 1.3, zIndex: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleNodeClick(topic)}
                            className={`relative w-6 h-6 rounded-full border-2 transition-all ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-deep' : ''}`}
                            style={{
                              backgroundColor: nodeColor + '30',
                              borderColor: nodeColor,
                              boxShadow: getNodeGlow(topic),
                            }}
                            title={`${topic.name} (${topic.originalStatus})`}
                          >
                            {topic.studyStatus === 'completed' && (
                              <Check className="w-3 h-3 text-complete absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    {/* Connect chapters with a line */}
                    {chIdx < constellation.chapters.length - 1 && (
                      <div className="flex justify-center my-1">
                        <div className="w-px h-3 bg-border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Topic detail popup */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTopic(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: getNodeColor(selectedTopic) + '20' }}
                >
                  {selectedTopic.originalStatus === 'C' && <Skull className="w-5 h-5 text-boss-light" />}
                  {selectedTopic.originalStatus === 'R' && <Shield className="w-5 h-5 text-xp" />}
                  {selectedTopic.originalStatus === 'P' && <Sword className="w-5 h-5 text-text-muted" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-text-primary">{selectedTopic.name}</h3>
                  <p className="text-xs text-text-muted font-mono">{selectedTopic.paper} - {selectedTopic.chapter}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono text-xp font-bold">{selectedTopic.xpValue} XP</span>
                <span className={`text-xs font-heading px-2 py-1 rounded ${
                  selectedTopic.studyStatus === 'completed'
                    ? 'bg-complete/20 text-complete'
                    : 'bg-bg-deep text-text-muted'
                }`}>
                  {selectedTopic.studyStatus === 'completed' ? 'Completed' : 'Not Started'}
                </span>
              </div>

              {selectedTopic.studyStatus !== 'completed' ? (
                <button
                  onClick={handleComplete}
                  className="w-full py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-heading font-semibold transition-all glow-purple"
                >
                  Mark Complete (+{selectedTopic.xpValue} XP)
                </button>
              ) : (
                <div className="text-center py-2 text-sm text-complete font-heading font-semibold">
                  Conquered on {selectedTopic.completedAt ? new Date(selectedTopic.completedAt).toLocaleDateString() : 'unknown'}
                </div>
              )}

              <button
                onClick={() => setSelectedTopic(null)}
                className="w-full mt-2 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
