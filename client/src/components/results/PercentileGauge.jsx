import { motion } from 'framer-motion';
import { iqBandColor } from '../../utils/scoring.js';

const TIERS = [
  { label: 'Exceptionally Superior', min: 98, iq: '145+' },
  { label: 'Very Superior',          min: 90, iq: '130+' },
  { label: 'Superior',               min: 75, iq: '120+' },
  { label: 'High Average',           min: 50, iq: '110+' },
  { label: 'Average',                min: 25, iq: '90–109' },
  { label: 'Below Average',          min: 0,  iq: '<90' },
];

export default function PercentileGauge({ percentile, band, iq }) {
  const color = iqBandColor(iq);

  return (
    <div className="card p-6 flex flex-col">
      <h3 className="font-bold text-rose-900 text-base mb-0.5">IQ Classification</h3>
      <p className="text-xs text-rose-400 mb-5">Where your score sits on the bell curve</p>

      {/* Bell curve */}
      <div className="mb-5">
        <svg viewBox="0 0 260 80" className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bellGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#F2DADE" />
              <stop offset="40%"  stopColor="#F2DADE" />
              <stop offset={`${Math.min(99, percentile)}%`} stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F2DADE" />
            </linearGradient>
          </defs>
          <path d="M 0 75 C 30 75, 50 70, 70 50 C 90 30, 100 5, 130 2 C 160 5, 170 30, 190 50 C 210 70, 230 75, 260 75 Z"
            fill="url(#bellGrad)" stroke="#E8BEC6" strokeWidth="1.5" />
          <motion.line
            x1={`${Math.min(98, Math.max(2, percentile) * 0.9 + 5)}`} y1="0"
            x2={`${Math.min(98, Math.max(2, percentile) * 0.9 + 5)}`} y2="75"
            stroke={color} strokeWidth="2" strokeDasharray="3 2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }} />
          <motion.circle
            cx={`${Math.min(98, Math.max(2, percentile) * 0.9 + 5)}`} cy="6" r="4" fill={color}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 300 }} />
        </svg>
        <div className="flex justify-between text-[10px] text-rose-300 mt-1 px-1">
          <span>Low</span><span>Average</span><span>High</span>
        </div>
      </div>

      {/* Tier list */}
      <div className="space-y-1.5 flex-1">
        {TIERS.map((tier, i) => {
          const active  = percentile >= tier.min;
          const current = band === tier.label;
          return (
            <motion.div key={tier.label}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.07, duration: 0.3 }}
              className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${active ? 'bg-rose-50' : ''}`}
              style={active && current ? { backgroundColor: `${color}10`, outline: `1px solid ${color}25` } : {}}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: active ? color : '#E8BEC6' }} />
                <span className={`text-xs font-medium ${active ? 'text-rose-800' : 'text-rose-300'}`}>
                  {tier.label}
                </span>
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-rose-400' : 'text-rose-200'}`}>
                {tier.iq}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
