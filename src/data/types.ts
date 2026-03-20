export type TopicStatus = 'C' | 'R' | 'P';
export type StudyStatus = 'not_started' | 'in_progress' | 'completed';

/** Progression order: C → R → P → done */
export const STATUS_PROGRESSION: TopicStatus[] = ['C', 'R', 'P'];

export function getNextStatus(current: TopicStatus): TopicStatus | 'done' {
  const idx = STATUS_PROGRESSION.indexOf(current);
  return idx < STATUS_PROGRESSION.length - 1 ? STATUS_PROGRESSION[idx + 1] : 'done';
}

/** Total XP available for a topic across all remaining stages */
export function getTotalRemainingXP(currentStatus: TopicStatus): number {
  const idx = STATUS_PROGRESSION.indexOf(currentStatus);
  return STATUS_PROGRESSION.slice(idx).reduce((sum, s) => sum + XP_VALUES[s], 0);
}

export interface Topic {
  id: string;
  paper: string;
  chapter: string;
  name: string;
  originalStatus: TopicStatus;
  currentStatus: TopicStatus;
  studyStatus: StudyStatus;
  completedAt?: string;
  xpValue: number;
  /** XP already earned from completed stages */
  xpEarned: number;
}

export interface Boss {
  name: string;
  paper: string;
  title: string;
  maxHP: number;
  currentHP: number;
  defeated: boolean;
}

export interface DayLog {
  date: string;
  topicsCompleted: string[];
  xpEarned: number;
  minutesStudied: number;
  focusSessions: number;
  focusXPEarned: number;
}

export interface GameState {
  topics: Topic[];
  bosses: Boss[];
  dayLogs: DayLog[];
  totalXP: number;
  level: number;
  campaignStartDate: string;
  focusSessions: number;
}

export interface BossConfig {
  name: string;
  paper: string;
  title: string;
}

export const BOSS_CONFIGS: BossConfig[] = [
  { name: 'Pure 1', paper: 'Pure 1', title: 'The Algebraic Sentinel' },
  { name: 'Pure 2', paper: 'Pure 2', title: 'The Calculus Warden' },
  { name: 'Stats 1', paper: 'Stats 1', title: 'The Probability Phantom' },
  { name: 'Stats 2', paper: 'Stats 2', title: 'The Distribution Dragon' },
  { name: 'Decision 1', paper: 'Decision 1', title: 'The Algorithm Architect' },
  { name: 'Further Pure 1', paper: 'Further Pure 1', title: 'The Matrix Master' },
];

export const XP_VALUES: Record<TopicStatus, number> = {
  C: 30,
  R: 15,
  P: 5,
};

export const FOCUS_SESSION_XP = 10;
export const BOSS_DEFEAT_XP = 100;
export const XP_PER_LEVEL = 100;
export const CAMPAIGN_DAYS = 14;
