import { Skull, Shield, Sword } from 'lucide-react';
import type { TopicStatus } from '../data/types';

interface StatusBadgeProps {
  status: TopicStatus;
  size?: 'sm' | 'md';
}

const config = {
  C: {
    icon: Skull,
    label: 'Learn',
    bg: 'bg-boss/20',
    text: 'text-boss-light',
    border: 'border-boss/30',
  },
  R: {
    icon: Shield,
    label: 'Review',
    bg: 'bg-xp/20',
    text: 'text-xp-light',
    border: 'border-xp/30',
  },
  P: {
    icon: Sword,
    label: 'Practice',
    bg: 'bg-complete/20',
    text: 'text-complete-light',
    border: 'border-complete/30',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const c = config[status];
  const Icon = c.icon;
  const isSmall = size === 'sm';

  return (
    <span className={`inline-flex items-center gap-1 ${isSmall ? 'px-1.5 py-0.5' : 'px-2 py-1'} rounded border ${c.bg} ${c.text} ${c.border}`}>
      <Icon className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span className={`font-heading font-semibold ${isSmall ? 'text-[10px]' : 'text-xs'}`}>{c.label}</span>
    </span>
  );
}
