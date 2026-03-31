import { motion } from 'framer-motion';
import OptionButton from './OptionButton.jsx';
import { DOMAIN_LABELS, DOMAIN_COLORS, DOMAIN_BG } from '../../utils/scoring.js';

const DOMAIN_ICONS = {
  pattern:   '◈',
  verbal:    '◉',
  numerical: '◇',
  spatial:   '◎',
};

export default function QuestionCard({ question, selectedOption, onSelect, questionNumber }) {
  const color = DOMAIN_COLORS[question.domain];
  const bg    = DOMAIN_BG[question.domain];
  const label = DOMAIN_LABELS[question.domain];
  const icon  = DOMAIN_ICONS[question.domain];

  return (
    <div className="card p-6 md:p-8 max-w-2xl mx-auto relative overflow-hidden">
      {/* Watermark question number */}
      <div
        className="absolute right-6 top-4 text-[7rem] font-black leading-none pointer-events-none select-none tabular-nums"
        style={{ color, opacity: 0.04 }}
      >
        {questionNumber}
      </div>

      {/* Domain badge + difficulty */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
          style={{ backgroundColor: bg, color }}
        >
          {icon} {label}
        </span>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i <= question.difficulty ? color : '#F2DADE',
                transform: i <= question.difficulty ? 'scale(1)' : 'scale(0.75)',
              }}
            />
          ))}
        </div>
      </div>

      <p className="text-rose-900 font-semibold text-base md:text-lg leading-relaxed mb-6 relative z-10">
        {question.prompt}
      </p>

      {question.svgData && (
        <div className="mb-6 p-4 rounded-2xl flex items-center justify-center relative z-10 border"
          style={{ backgroundColor: bg, borderColor: `${color}20` }}>
          <div className="max-w-full" dangerouslySetInnerHTML={{ __html: question.svgData }} />
        </div>
      )}

      <div className="flex flex-col gap-2.5 relative z-10">
        {Object.entries(question.options).map(([key, text], i) => (
          <motion.div key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.055, duration: 0.3, ease: 'easeOut' }}
          >
            <OptionButton label={key} text={text} selected={selectedOption === key}
              onClick={() => onSelect(key)} accentColor={color} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
