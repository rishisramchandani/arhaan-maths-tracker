import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import StatusBadge from './StatusBadge';
import DamageNumber from './DamageNumber';
import type { Topic } from '../data/types';
import { XP_VALUES, getNextStatus } from '../data/types';
import { useGame } from '../context/GameContext';

interface TopicRowProps {
  topic: Topic;
  onMilestone?: (message: string, type: 'boss_defeated' | 'level_up' | 'milestone' | 'first_blood') => void;
}

export default function TopicRow({ topic, onMilestone }: TopicRowProps) {
  const { completeTopic, uncompleteTopic } = useGame();
  const [showDamage, setShowDamage] = useState(false);
  const [damageValue, setDamageValue] = useState(0);

  const isFullyComplete = topic.studyStatus === 'completed';
  const isInProgress = topic.studyStatus === 'in_progress';
  const currentStatus = topic.currentStatus || topic.originalStatus;
  const currentStageXP = XP_VALUES[currentStatus];
  const next = getNextStatus(currentStatus);

  const handleAdvance = useCallback(() => {
    if (isFullyComplete) return;

    const result = completeTopic(topic.id);
    setDamageValue(result.xpGained);
    setShowDamage(true);

    // Confetti scales with stage importance
    if (result.stageDone === 'C') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#EF4444', '#F87171', '#FCA5A5', '#8B5CF6'],
      });
    } else if (result.stageDone === 'R') {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#FCD34D'],
      });
    }

    if (result.bossDefeated) {
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#8B5CF6', '#22C55E', '#F59E0B', '#EF4444'],
        });
        onMilestone?.(`BOSS DEFEATED: ${topic.paper}!`, 'boss_defeated');
      }, 500);
    }

    if (result.leveledUp) {
      setTimeout(() => {
        onMilestone?.(`LEVEL UP! You are now Level ${result.newLevel}`, 'level_up');
      }, result.bossDefeated ? 3500 : 300);
    }
  }, [isFullyComplete, completeTopic, topic, onMilestone]);

  const handleUndo = useCallback(() => {
    uncompleteTopic(topic.id);
  }, [uncompleteTopic, topic.id]);

  // Build the progression indicator: shows which stages are done
  const stages = (() => {
    const all: { status: string; done: boolean }[] = [];
    const startIdx = ['C', 'R', 'P'].indexOf(topic.originalStatus);
    const currentIdx = ['C', 'R', 'P'].indexOf(currentStatus);
    for (let i = startIdx; i < 3; i++) {
      const s = ['C', 'R', 'P'][i];
      all.push({ status: s, done: isFullyComplete || i < currentIdx });
    }
    return all;
  })();

  return (
    <motion.div
      layout
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200
        ${isFullyComplete
          ? 'bg-complete/5 border-complete/20'
          : isInProgress
            ? 'bg-primary/5 border-primary/20'
            : 'bg-bg-card/50 border-border hover:border-primary/30 hover:bg-bg-card'
        }
      `}
    >
      {/* Action button */}
      {isFullyComplete ? (
        <button
          onClick={handleUndo}
          className="shrink-0 w-7 h-7 rounded-md border-2 bg-complete border-complete text-bg-deep hover:bg-complete-dark flex items-center justify-center transition-all"
          title="Reset topic"
        >
          <Check className="w-4 h-4" />
        </button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAdvance}
          className="shrink-0 w-7 h-7 rounded-md border-2 border-border hover:border-primary bg-transparent hover:bg-primary/10 flex items-center justify-center transition-all"
          title={next === 'done' ? 'Complete topic' : `Advance to ${next === 'R' ? 'Review' : 'Practice'}`}
        >
          <ChevronRight className="w-4 h-4 text-text-muted" />
        </motion.button>
      )}

      {/* Current stage badge */}
      <StatusBadge status={currentStatus} size="sm" />

      {/* Progression dots */}
      {stages.length > 1 && (
        <div className="flex items-center gap-1 shrink-0">
          {stages.map((s, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                s.done ? 'bg-complete' : s.status === currentStatus && !isFullyComplete ? 'bg-primary animate-pulse' : 'bg-border'
              }`}
              title={`${s.status === 'C' ? 'Learn' : s.status === 'R' ? 'Review' : 'Practice'}${s.done ? ' (done)' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Topic name */}
      <span className={`flex-1 text-sm font-body ${isFullyComplete ? 'text-text-muted line-through' : 'text-text-primary'}`}>
        {topic.name}
      </span>

      {/* XP for current stage */}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentStatus + (isFullyComplete ? '-done' : '')}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className={`text-xs font-mono shrink-0 ${isFullyComplete ? 'text-complete' : 'text-xp'}`}
        >
          {isFullyComplete ? `+${topic.xpEarned}` : `+${currentStageXP}`} XP
        </motion.span>
      </AnimatePresence>

      {/* Damage number */}
      <DamageNumber value={damageValue} show={showDamage} onComplete={() => setShowDamage(false)} />
    </motion.div>
  );
}
