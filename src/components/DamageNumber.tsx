import { motion, AnimatePresence } from 'framer-motion';

interface DamageNumberProps {
  value: number;
  show: boolean;
  onComplete?: () => void;
}

export default function DamageNumber({ value, show, onComplete }: DamageNumberProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -60, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          onAnimationComplete={onComplete}
          className="absolute -top-2 right-4 pointer-events-none z-50"
        >
          <span className="font-display font-bold text-xl text-xp text-glow-amber">
            +{value} XP
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
