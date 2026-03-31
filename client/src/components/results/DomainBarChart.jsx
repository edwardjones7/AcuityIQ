import { motion } from 'framer-motion';
import { DOMAIN_LABELS, DOMAIN_COLORS, DOMAIN_BG, DOMAIN_ICONS, iqBandColor } from '../../utils/scoring.js';

export default function DomainBarChart({ domains }) {
  const entries = Object.entries(domains);
  const minIQ = 60, maxIQ = 160;

  return (
    <div className="card p-6">
      <h3 className="font-bold text-rose-900 text-base mb-0.5">Domain Scores</h3>
      <p className="text-xs text-rose-400 mb-6">IQ score per cognitive domain</p>

      <div className="space-y-5">
        {entries.map(([domain, d], i) => {
          const color     = DOMAIN_COLORS[domain];
          const bg        = DOMAIN_BG[domain];
          const icon      = DOMAIN_ICONS[domain];
          const bandColor = iqBandColor(d.iq);
          const pct       = ((d.iq - minIQ) / (maxIQ - minIQ)) * 100;
          const avgPct    = ((100 - minIQ) / (maxIQ - minIQ)) * 100;

          return (
            <motion.div key={domain}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.45, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0"
                    style={{ backgroundColor: bg, color }}>
                    {icon}
                  </span>
                  <span className="text-xs font-semibold text-rose-700">
                    {DOMAIN_LABELS[domain].split(' ')[0]}
                  </span>
                </div>
                <span className="text-base font-black tabular-nums" style={{ color: bandColor }}>{d.iq}</span>
              </div>

              <div className="relative h-2 bg-rose-100 rounded-full overflow-visible">
                <div className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-rose-300 z-10"
                  style={{ left: `${avgPct}%` }} />
                <motion.div className="absolute left-0 top-0 h-full rounded-full overflow-hidden"
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.1 }}
                  style={{ background: `linear-gradient(90deg, ${color}60, ${color})` }} />
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-rose-300">{d.questionsAnswered} questions</span>
                <span className="text-[10px] text-rose-300">{Math.round(d.rawAccuracy * 100)}% accuracy</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-[10px] text-rose-300">
        <div className="w-px h-3 bg-rose-300" />
        <span>Average (IQ 100)</span>
      </div>
    </div>
  );
}
