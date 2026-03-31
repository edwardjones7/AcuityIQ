import { motion } from 'framer-motion';

export default function OptionButton({ label, text, selected, onClick, disabled, accentColor }) {
  const color = accentColor || '#7A1E39';

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled && !selected ? { scale: 0.985 } : {}}
      className={`
        w-full text-left px-4 py-3.5 rounded-2xl border-[1.5px] transition-all duration-200
        flex items-center gap-3 group relative overflow-hidden
        ${selected
          ? 'shadow-warm-sm'
          : disabled
          ? 'opacity-40 cursor-not-allowed border-rose-100 bg-rose-50'
          : 'border-rose-200 bg-white hover:border-rose-300 hover:shadow-warm-sm cursor-pointer'
        }
      `}
      style={selected ? { borderColor: color, backgroundColor: `${color}08` } : {}}
    >
      <span
        className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200"
        style={selected
          ? { backgroundColor: color, color: 'white' }
          : { backgroundColor: '#FAF0F3', color: '#9B3A58' }
        }
      >
        {label}
      </span>

      <span className={`text-sm font-medium leading-snug transition-colors duration-200 ${
        selected ? 'text-rose-900' : 'text-rose-700 group-hover:text-rose-900'
      }`}>
        {text}
      </span>

      {selected && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="ml-auto flex-shrink-0"
          style={{ color }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}
