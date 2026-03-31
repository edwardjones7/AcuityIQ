import { motion } from 'framer-motion';
import { DOMAIN_COLORS } from '../../utils/scoring.js';

export default function ProgressBar({ current, total, domains }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs font-semibold text-rose-700">
          {current} <span className="text-rose-300 font-normal">of {total}</span>
        </span>
        <span className="text-xs font-bold text-rose-900 tabular-nums">{percent}%</span>
      </div>

      <div className="w-full bg-rose-100 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-1.5 rounded-full"
          style={{ background: 'linear-gradient(90deg, #E11D48 0%, #BE185D 100%)' }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {domains && (
        <div className="flex gap-4 mt-2.5 flex-wrap">
          {Object.entries(domains).map(([domain, state]) => {
            const color = DOMAIN_COLORS[domain];
            const pct   = Math.round((state.questionsAnswered / 10) * 100);
            return (
              <div key={domain} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium text-rose-500 capitalize">{domain}</span>
                  <div className="w-10 h-0.5 bg-rose-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-0.5 rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
