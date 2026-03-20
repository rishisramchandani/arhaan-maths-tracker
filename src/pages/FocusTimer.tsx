import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Trophy, ChevronDown, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import MilestoneToast from '../components/MilestoneToast';

type TimerPhase = 'idle' | 'focus' | 'break';

const DURATION_OPTIONS = [
  { label: '15 min', value: 15, xp: 5 },
  { label: '25 min', value: 25, xp: 10 },
  { label: '30 min', value: 30, xp: 12 },
  { label: '45 min', value: 45, xp: 18 },
  { label: '60 min', value: 60, xp: 25 },
];
const DEFAULT_DURATION = 45; // 45 minutes default
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const SESSIONS_BEFORE_LONG = 4;

function getXPForDuration(mins: number) {
  return DURATION_OPTIONS.find(d => d.value === mins)?.xp ?? Math.round(mins * 0.4);
}

function fireCelebration() {
  // Multi-burst confetti celebration
  const colors = ['#8B5CF6', '#A78BFA', '#F59E0B', '#FCD34D', '#22C55E'];
  // Center burst
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.5, x: 0.5 }, colors, startVelocity: 35 });
  // Left burst
  setTimeout(() => confetti({ particleCount: 40, angle: 60, spread: 50, origin: { y: 0.65, x: 0.2 }, colors }), 150);
  // Right burst
  setTimeout(() => confetti({ particleCount: 40, angle: 120, spread: 50, origin: { y: 0.65, x: 0.8 }, colors }), 300);
  // Final shower
  setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.3, x: 0.5 }, colors, gravity: 0.8, scalar: 1.2 }), 500);
}

export default function FocusTimer() {
  const { addFocusSession, getTodayLog } = useGame();
  const todayLog = getTodayLog();

  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [focusMins, setFocusMins] = useState(DEFAULT_DURATION);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(todayLog.focusSessions);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionXP, setCompletionXP] = useState(0);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'boss_defeated' | 'level_up' | 'milestone' | 'first_blood' }>({ show: false, message: '', type: 'milestone' });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const focusDuration = focusMins * 60;
  const totalDuration = phase === 'break'
    ? (sessionsToday % SESSIONS_BEFORE_LONG === 0 && sessionsToday > 0 ? LONG_BREAK : SHORT_BREAK)
    : focusDuration;

  const progress = 1 - timeLeft / totalDuration;

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    if (phase === 'focus') {
      const xp = getXPForDuration(focusMins);
      addFocusSession(focusMins, xp);
      setSessionsToday(prev => prev + 1);

      // Show completion overlay
      setCompletionXP(xp);
      setShowCompletion(true);
      fireCelebration();
      setTimeout(() => setShowCompletion(false), 3000);

      setToast({ show: true, message: `Focus session complete! +${xp} XP`, type: 'milestone' });

      // Switch to break
      const nextSessions = sessionsToday + 1;
      const breakTime = nextSessions % SESSIONS_BEFORE_LONG === 0 ? LONG_BREAK : SHORT_BREAK;
      setPhase('break');
      setTimeLeft(breakTime);
    } else if (phase === 'break') {
      setToast({ show: true, message: 'Break over. Ready for battle.', type: 'first_blood' });
      setPhase('idle');
      setTimeLeft(focusDuration);
    }
  }, [phase, addFocusSession, sessionsToday, focusMins, focusDuration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, handleTimerComplete]);

  const startFocus = () => {
    setPhase('focus');
    setTimeLeft(focusDuration);
    setIsRunning(true);
    startTimeRef.current = Date.now();
    setShowDurationPicker(false);
  };

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setPhase('idle');
    setTimeLeft(focusDuration);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const skipBreak = () => {
    setIsRunning(false);
    setPhase('idle');
    setTimeLeft(focusDuration);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const selectDuration = (mins: number) => {
    setFocusMins(mins);
    setTimeLeft(mins * 60);
    setShowDurationPicker(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Ring params
  const ringSize = 280;
  const strokeWidth = 10;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const ringColor = phase === 'break' ? '#22C55E' : '#8B5CF6';

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto relative">
      <MilestoneToast {...toast} onClose={() => setToast(t => ({ ...t, show: false }))} />

      {/* Completion Overlay */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            {/* Radial flash */}
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute w-48 h-48 rounded-full bg-primary/30"
            />
            {/* XP badge */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, y: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 3, -3, 0] }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary via-primary-light to-xp flex items-center justify-center shadow-2xl"
                style={{ boxShadow: '0 0 40px #8B5CF680, 0 0 80px #F59E0B40' }}
              >
                <Zap className="w-14 h-14 text-white drop-shadow-lg" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-3xl font-bold text-xp text-glow-amber"
              >
                +{completionXP} XP
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-heading text-sm text-text-secondary uppercase tracking-wider"
              >
                Session Complete
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Timer className="w-4 h-4 text-primary" />
          <span className="text-xs font-display font-bold text-primary uppercase tracking-widest">Battle Station</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Focus Timer</h1>
      </motion.div>

      {/* Duration Picker (idle only) */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex justify-center">
              <button
                onClick={() => setShowDurationPicker(!showDurationPicker)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-border-light transition-all"
              >
                <span className="font-mono text-sm font-semibold">{focusMins} min</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDurationPicker ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <AnimatePresence>
              {showDurationPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-center gap-2 mt-3"
                >
                  {DURATION_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => selectDuration(opt.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                        focusMins === opt.value
                          ? 'bg-primary text-white glow-purple'
                          : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-primary/30'
                      }`}
                    >
                      <div>{opt.label}</div>
                      <div className={`text-[10px] mt-0.5 ${focusMins === opt.value ? 'text-white/70' : 'text-text-muted'}`}>
                        +{opt.xp} XP
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="relative" style={{ width: ringSize, height: ringSize }}>
          {/* Pulse glow behind ring when running */}
          {isRunning && phase === 'focus' && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: `radial-gradient(circle, ${ringColor}20 0%, transparent 70%)` }}
            />
          )}
          <svg width={ringSize} height={ringSize} className="-rotate-90">
            {/* Track */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke="#1F2937"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress */}
            <motion.circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference * (1 - progress) }}
              transition={{ duration: 0.5, ease: 'linear' }}
              style={{ filter: `drop-shadow(0 0 8px ${ringColor}60)` }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={`${minutes}:${seconds}`}
              className="font-mono text-5xl font-bold text-text-primary"
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </motion.span>
            <span className={`text-xs font-heading uppercase tracking-wider mt-2 ${
              phase === 'focus' ? 'text-primary' : phase === 'break' ? 'text-complete' : 'text-text-muted'
            }`}>
              {phase === 'idle' ? 'Ready' : phase === 'focus' ? 'Focusing' : 'Break Time'}
            </span>
            {phase === 'focus' && (
              <span className="text-[10px] font-mono text-text-muted mt-1">
                +{getXPForDuration(focusMins)} XP on completion
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-4 mb-8"
      >
        {phase === 'idle' ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startFocus}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-heading font-semibold transition-all glow-purple"
          >
            <Play className="w-5 h-5" /> Begin Focus
          </motion.button>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={togglePause}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-heading font-semibold transition-all ${
                isRunning
                  ? 'bg-xp/20 text-xp border border-xp/30 hover:bg-xp/30'
                  : 'bg-primary hover:bg-primary-dark text-white glow-purple'
              }`}
            >
              {isRunning ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> Resume</>}
            </motion.button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-border-light transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {phase === 'break' && (
              <button
                onClick={skipBreak}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-primary hover:border-primary/30 transition-all"
              >
                Skip Break
              </button>
            )}
          </>
        )}
      </motion.div>

      {/* Session Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-bg-card rounded-xl border border-border p-5"
      >
        <h3 className="font-heading font-semibold text-sm text-text-secondary mb-4 uppercase tracking-wider">
          Today's Sessions
        </h3>

        {/* Session dots */}
        <div className="flex items-center gap-3 mb-4">
          {Array.from({ length: Math.max(SESSIONS_BEFORE_LONG, sessionsToday) }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                i < sessionsToday
                  ? 'bg-primary text-white'
                  : i === sessionsToday && phase === 'focus'
                    ? 'bg-primary/30 text-primary border-2 border-primary animate-pulse'
                    : 'bg-bg-dark text-text-muted border border-border'
              }`}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="font-mono text-lg font-bold text-primary">{sessionsToday}</div>
            <div className="text-[10px] font-heading text-text-muted uppercase">Sessions</div>
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-xp">{todayLog.xpEarned || sessionsToday * getXPForDuration(focusMins)}</div>
            <div className="text-[10px] font-heading text-text-muted uppercase">XP Earned</div>
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-complete">{todayLog.minutesStudied || sessionsToday * focusMins}m</div>
            <div className="text-[10px] font-heading text-text-muted uppercase">Focused</div>
          </div>
        </div>

        {sessionsToday >= SESSIONS_BEFORE_LONG && sessionsToday % SESSIONS_BEFORE_LONG === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-xp/10 border border-xp/20"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-xp" />
              <span className="text-sm font-heading font-semibold text-xp">Power Move Available!</span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {SESSIONS_BEFORE_LONG} sessions done. Try a past paper question for bonus XP.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
