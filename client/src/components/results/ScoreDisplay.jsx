import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { iqBandColor } from '../../utils/scoring.js';

function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    const id = setTimeout(() => requestAnimationFrame(tick), 200);
    return () => clearTimeout(id);
  }, [target, duration]);
  return val;
}

function Ring({ percentile, color, size = 220 }) {
  const r = 88, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const dash  = (percentile / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F2DADE" strokeWidth="8" />
      <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }} />
    </svg>
  );
}

export default function ScoreDisplay({ iq, percentile, band }) {
  const color   = iqBandColor(iq);
  const display = useCountUp(iq, 1800);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="card p-8 md:p-10 relative overflow-hidden">

      <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }} />

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Ring */}
        <div className="relative flex-shrink-0" style={{ width: 220, height: 220 }}>
          <Ring percentile={percentile} color={color} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Your IQ</span>
            <span className="text-6xl font-black tabular-nums leading-none" style={{ color }}>{display}</span>
            <span className="mt-2 text-xs font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: `${color}12`, color }}>{band}</span>
          </div>
        </div>

        {/* Right stats */}
        <div className="flex-1 space-y-5 text-center md:text-left">
          <div>
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">Percentile Rank</p>
            <p className="text-4xl font-black text-rose-900 tabular-nums">
              {percentile}<span className="text-xl font-semibold text-rose-300">th</span>
            </p>
            <p className="text-sm text-rose-400 mt-1">
              Higher than <strong className="text-rose-800">{percentile}%</strong> of the population
            </p>
          </div>
          <div className="h-px bg-rose-100" />
          <div>
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">Classification</p>
            <p className="text-lg font-bold" style={{ color }}>{band}</p>
          </div>

          {/* IQ scale */}
          <div>
            <div className="flex justify-between text-[10px] text-rose-300 mb-1">
              <span>70</span><span>100</span><span>130</span><span>160</span>
            </div>
            <div className="relative h-2 bg-rose-100 rounded-full overflow-visible">
              <div className="absolute inset-0 rounded-full overflow-hidden"
                style={{ background: 'linear-gradient(90deg, #9F1239, #E11D48, #BE185D, #7C3AED, #065F46)' }} />
              <motion.div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full border-2 shadow-warm-sm"
                style={{ borderColor: color }}
                initial={{ left: '0%' }}
                animate={{ left: `${Math.max(0, Math.min(100, ((iq - 70) / 90) * 100))}%` }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
