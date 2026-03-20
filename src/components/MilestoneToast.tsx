import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Skull, Star, Zap } from 'lucide-react';
import { useEffect } from 'react';

interface MilestoneToastProps {
  message: string;
  type: 'boss_defeated' | 'level_up' | 'milestone' | 'first_blood';
  show: boolean;
  onClose: () => void;
}

const icons = {
  boss_defeated: Skull,
  level_up: Star,
  milestone: Trophy,
  first_blood: Zap,
};

const colors = {
  boss_defeated: 'border-boss/50 bg-boss/10',
  level_up: 'border-primary/50 bg-primary/10',
  milestone: 'border-xp/50 bg-xp/10',
  first_blood: 'border-complete/50 bg-complete/10',
};

const textColors = {
  boss_defeated: 'text-boss-light',
  level_up: 'text-primary-light',
  milestone: 'text-xp-light',
  first_blood: 'text-complete-light',
};

export default function MilestoneToast({ message, type, show, onClose }: MilestoneToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-lg border ${colors[type]} backdrop-blur-md shadow-lg cursor-pointer`}
          onClick={onClose}
        >
          <Icon className={`w-5 h-5 ${textColors[type]}`} />
          <span className={`font-heading font-semibold text-sm ${textColors[type]}`}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
