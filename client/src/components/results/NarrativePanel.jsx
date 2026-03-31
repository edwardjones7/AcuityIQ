import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { key: 'overall',   label: 'Overview',  icon: '◉', color: '#0369A1' },
  { key: 'strengths', label: 'Strengths', icon: '▲', color: '#065F46' },
  { key: 'areas',     label: 'Growth',    icon: '◇', color: '#E11D48' },
  { key: 'profile',   label: 'Profile',   icon: '◈', color: '#7C3AED' },
];

export default function NarrativePanel({ narrative }) {
  const [active, setActive] = useState('overall');
  const sect = SECTIONS.find(s => s.key === active);

  return (
    <div className="card p-6">
      <h3 className="font-bold text-rose-900 text-base mb-0.5">In-Depth Analysis</h3>
      <p className="text-xs text-rose-400 mb-5">Your personalised cognitive report</p>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-0.5">
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setActive(s.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-150 flex-shrink-0
              ${active === s.key ? 'text-white' : 'text-rose-500 hover:text-rose-800 hover:bg-rose-100/60'}`}
          >
            {active === s.key && (
              <motion.div layoutId="tab-pill" className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: s.color }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
            )}
            <span className="relative z-10">{s.icon}</span>
            <span className="relative z-10">{s.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="rounded-2xl p-5 min-h-[8rem]"
          style={{ backgroundColor: `${sect.color}07`, border: `1px solid ${sect.color}18` }}
        >
          {narrative[active]
            ? narrative[active].split('\n\n').map((para, i) => (
                <p key={i} className={`text-sm text-rose-800 leading-relaxed ${i > 0 ? 'mt-3' : ''}`}>{para}</p>
              ))
            : <p className="text-sm text-rose-300">No data for this section.</p>
          }
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
