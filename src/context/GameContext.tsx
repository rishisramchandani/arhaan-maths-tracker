import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react';
import type { Topic, Boss, DayLog, GameState } from '../data/types';
import { BOSS_CONFIGS, FOCUS_SESSION_XP, BOSS_DEFEAT_XP, XP_PER_LEVEL, XP_VALUES, getNextStatus, getTotalRemainingXP } from '../data/types';
import { createAllTopics } from '../data/topics';
import { format } from 'date-fns';

interface GameContextType {
  state: GameState;
  completeTopic: (topicId: string) => { xpGained: number; bossDefeated: boolean; leveledUp: boolean; newLevel: number; stageDone: string };
  uncompleteTopic: (topicId: string) => void;
  addFocusSession: (minutes: number, xp?: number) => void;
  getTopicsForPaper: (paper: string) => Topic[];
  getBoss: (paper: string) => Boss | undefined;
  getTodayLog: () => DayLog;
  getStreak: () => number;
  resetState: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

const STORAGE_KEY = 'maths-campaign-state';

function buildBosses(topics: Topic[]): Boss[] {
  return BOSS_CONFIGS.map(config => {
    const paperTopics = topics.filter(t => t.paper === config.paper);
    // Max HP = total XP available across all stages for all topics
    const maxHP = paperTopics.reduce((sum, t) => sum + getTotalRemainingXP(t.originalStatus), 0);
    // Current HP = remaining XP (total - earned)
    const earnedHP = paperTopics.reduce((sum, t) => sum + (t.xpEarned || 0), 0);
    const currentHP = maxHP - earnedHP;
    return {
      name: config.name,
      paper: config.paper,
      title: config.title,
      maxHP,
      currentHP,
      defeated: currentHP <= 0 && maxHP > 0,
    };
  });
}

function calculateTotalXP(topics: Topic[], dayLogs: DayLog[], bosses: Boss[]): number {
  // Sum XP earned across all stages (not just completed topics)
  const topicXP = topics.reduce((sum, t) => sum + (t.xpEarned || 0), 0);
  const focusXP = dayLogs.reduce((sum, d) => sum + (d.focusXPEarned || d.focusSessions * FOCUS_SESSION_XP), 0);
  const bossXP = bosses.filter(b => b.defeated).length * BOSS_DEFEAT_XP;
  return topicXP + focusXP + bossXP;
}

function createInitialState(): GameState {
  const topics = createAllTopics();
  const bosses = buildBosses(topics);
  return {
    topics,
    bosses,
    dayLogs: [],
    totalXP: 0,
    level: 0,
    campaignStartDate: format(new Date(), 'yyyy-MM-dd'),
    focusSessions: 0,
  };
}

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as GameState;
      // Migrate topics missing new fields
      parsed.topics = parsed.topics.map(t => ({
        ...t,
        currentStatus: t.currentStatus || t.originalStatus,
        xpEarned: t.xpEarned ?? (t.studyStatus === 'completed' ? getTotalRemainingXP(t.originalStatus) : 0),
      }));
      // Rebuild bosses from topic data to ensure consistency
      parsed.bosses = buildBosses(parsed.topics);
      parsed.totalXP = calculateTotalXP(parsed.topics, parsed.dayLogs, parsed.bosses);
      parsed.level = Math.floor(parsed.totalXP / XP_PER_LEVEL);
      return parsed;
    }
  } catch {
    // Ignore parse errors, return fresh state
  }
  return createInitialState();
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const completeTopic = useCallback((topicId: string) => {
    let xpGained = 0;
    let bossDefeated = false;
    let leveledUp = false;
    let newLevel = 0;
    let stageDone = '';

    setState(prev => {
      const topic = prev.topics.find(t => t.id === topicId);
      if (!topic || topic.studyStatus === 'completed') return prev;

      const currentStatus = topic.currentStatus || topic.originalStatus;
      const stageXP = XP_VALUES[currentStatus];
      const next = getNextStatus(currentStatus);
      xpGained = stageXP;
      stageDone = currentStatus;

      const topics = prev.topics.map(t => {
        if (t.id !== topicId) return t;

        if (next === 'done') {
          // Final stage — topic fully completed
          return {
            ...t,
            currentStatus: currentStatus,
            studyStatus: 'completed' as const,
            completedAt: new Date().toISOString(),
            xpEarned: (t.xpEarned || 0) + stageXP,
          };
        } else {
          // Advance to next stage
          return {
            ...t,
            currentStatus: next,
            studyStatus: 'in_progress' as const,
            xpEarned: (t.xpEarned || 0) + stageXP,
          };
        }
      });

      const bosses = buildBosses(topics);
      const today = format(new Date(), 'yyyy-MM-dd');
      const dayLogs = [...prev.dayLogs];
      let todayLog = dayLogs.find(d => d.date === today);
      if (!todayLog) {
        todayLog = { date: today, topicsCompleted: [], xpEarned: 0, minutesStudied: 0, focusSessions: 0, focusXPEarned: 0 };
        dayLogs.push(todayLog);
      }
      todayLog.topicsCompleted = [...todayLog.topicsCompleted, topicId];
      todayLog.xpEarned += xpGained;

      // Check if a boss was just defeated
      const updatedTopic = topics.find(t => t.id === topicId);
      if (updatedTopic) {
        const boss = bosses.find(b => b.paper === updatedTopic.paper);
        const prevBoss = prev.bosses.find(b => b.paper === updatedTopic.paper);
        if (boss?.defeated && !prevBoss?.defeated) {
          bossDefeated = true;
          xpGained += BOSS_DEFEAT_XP;
          todayLog.xpEarned += BOSS_DEFEAT_XP;
        }
      }

      const totalXP = calculateTotalXP(topics, dayLogs, bosses);
      newLevel = Math.floor(totalXP / XP_PER_LEVEL);
      leveledUp = newLevel > prev.level;

      return {
        ...prev,
        topics,
        bosses,
        dayLogs,
        totalXP,
        level: newLevel,
      };
    });

    return { xpGained, bossDefeated, leveledUp, newLevel, stageDone };
  }, []);

  const uncompleteTopic = useCallback((topicId: string) => {
    setState(prev => {
      const topics = prev.topics.map(t => {
        if (t.id === topicId) {
          return {
            ...t,
            currentStatus: t.originalStatus,
            studyStatus: 'not_started' as const,
            completedAt: undefined,
            xpEarned: 0,
          };
        }
        return t;
      });

      const bosses = buildBosses(topics);
      const totalXP = calculateTotalXP(topics, prev.dayLogs, bosses);
      const level = Math.floor(totalXP / XP_PER_LEVEL);

      return { ...prev, topics, bosses, totalXP, level };
    });
  }, []);

  const addFocusSession = useCallback((minutes: number, xp?: number) => {
    setState(prev => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const dayLogs = [...prev.dayLogs];
      let todayLog = dayLogs.find(d => d.date === today);
      if (!todayLog) {
        todayLog = { date: today, topicsCompleted: [], xpEarned: 0, minutesStudied: 0, focusSessions: 0, focusXPEarned: 0 };
        dayLogs.push(todayLog);
      }
      const earnedXP = xp ?? FOCUS_SESSION_XP;
      todayLog.focusSessions += 1;
      todayLog.minutesStudied += minutes;
      todayLog.xpEarned += earnedXP;
      todayLog.focusXPEarned = (todayLog.focusXPEarned || 0) + earnedXP;

      const totalXP = calculateTotalXP(prev.topics, dayLogs, prev.bosses);
      const level = Math.floor(totalXP / XP_PER_LEVEL);

      return {
        ...prev,
        dayLogs,
        totalXP,
        level,
        focusSessions: prev.focusSessions + 1,
      };
    });
  }, []);

  const getTopicsForPaper = useCallback((paper: string) => {
    return state.topics.filter(t => t.paper === paper);
  }, [state.topics]);

  const getBoss = useCallback((paper: string) => {
    return state.bosses.find(b => b.paper === paper);
  }, [state.bosses]);

  const getTodayLog = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return state.dayLogs.find(d => d.date === today) || {
      date: today,
      topicsCompleted: [],
      xpEarned: 0,
      minutesStudied: 0,
      focusSessions: 0,
      focusXPEarned: 0,
    };
  }, [state.dayLogs]);

  const getStreak = useCallback(() => {
    const sorted = [...state.dayLogs]
      .filter(d => d.topicsCompleted.length > 0 || d.focusSessions > 0)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (sorted.length === 0) return 0;

    const today = format(new Date(), 'yyyy-MM-dd');
    let streak = 0;
    let checkDate = new Date(today);

    // If today has no activity, start checking from yesterday
    if (!sorted.find(d => d.date === today)) {
      checkDate = new Date(checkDate);
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (let i = 0; i < 30; i++) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      if (sorted.find(d => d.date === dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [state.dayLogs]);

  const resetState = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      completeTopic,
      uncompleteTopic,
      addFocusSession,
      getTopicsForPaper,
      getBoss,
      getTodayLog,
      getStreak,
      resetState,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
