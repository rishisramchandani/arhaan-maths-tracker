import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface XPCounterProps {
  value: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function XPCounter({ value, label, size = 'md', className = '' }: XPCounterProps) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, v => Math.round(v).toLocaleString());
  const [displayVal, setDisplayVal] = useState('0');

  useEffect(() => {
    spring.set(value);
    const unsub = display.on('change', v => setDisplayVal(v));
    return unsub;
  }, [value, spring, display]);

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <motion.span
        className={`font-mono font-bold text-xp ${sizes[size]} text-glow-amber`}
        key={value}
      >
        {displayVal}
      </motion.span>
      {label && <span className="text-xs font-heading text-text-muted uppercase tracking-wider">{label}</span>}
    </div>
  );
}
