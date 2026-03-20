import { motion } from 'framer-motion';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { useGame } from '../context/GameContext';

export default function CampaignGrid() {
  const { state } = useGame();
  const startDate = parseISO(state.campaignStartDate);
  const today = new Date();

  const days = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(startDate, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = state.dayLogs.find(d => d.date === dateStr);
    const xp = log?.xpEarned || 0;
    const isToday = isSameDay(date, today);
    const isFuture = date > today;

    let intensity = 0;
    if (xp > 0) intensity = 1;
    if (xp >= 30) intensity = 2;
    if (xp >= 80) intensity = 3;
    if (xp >= 150) intensity = 4;

    return { date, dateStr, xp, isToday, isFuture, intensity, log };
  });

  const getColor = (intensity: number, _isToday: boolean, isFuture: boolean) => {
    if (isFuture) return 'bg-bg-dark border-border';
    if (intensity === 0) return 'bg-bg-dark border-border';
    if (intensity === 1) return 'bg-primary/20 border-primary/30';
    if (intensity === 2) return 'bg-primary/40 border-primary/50';
    if (intensity === 3) return 'bg-primary/60 border-primary/70';
    return 'bg-primary border-primary';
  };

  return (
    <div>
      <h3 className="font-heading font-semibold text-sm text-text-secondary mb-3 uppercase tracking-wider">
        14-Day Campaign
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <motion.div
            key={day.dateStr}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="relative group"
          >
            <div
              className={`
                aspect-square rounded-lg border-2 flex flex-col items-center justify-center
                ${getColor(day.intensity, day.isToday, day.isFuture)}
                ${day.isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-deep' : ''}
                transition-all duration-300
              `}
              style={day.isToday ? { animation: 'pulse-glow 2s infinite' } : {}}
            >
              <span className={`text-[10px] font-mono ${day.isToday ? 'text-text-primary font-bold' : 'text-text-muted'}`}>
                {format(day.date, 'd')}
              </span>
              {day.xp > 0 && (
                <span className="text-[9px] font-mono text-xp font-semibold">
                  {day.xp}
                </span>
              )}
            </div>
            {/* Tooltip */}
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
              <div className="bg-bg-card border border-border rounded px-2 py-1 text-[10px] font-mono text-text-secondary whitespace-nowrap shadow-lg">
                <div>{format(day.date, 'EEE dd MMM')}</div>
                {day.log && (
                  <>
                    <div className="text-xp">{day.xp} XP</div>
                    <div>{day.log.topicsCompleted.length} topics</div>
                  </>
                )}
                {day.isToday && <div className="text-primary font-bold">TODAY</div>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
