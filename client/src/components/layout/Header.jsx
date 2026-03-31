import { motion } from 'framer-motion';
import { Wordmark } from '../Logo.jsx';

export default function Header({ title, subtitle, minimal = false }) {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-rose-50/80 backdrop-blur-xl border-b border-rose-200/60 sticky top-0 z-30"
    >
      <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <Wordmark size={22} />

        {subtitle && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-rose-400 font-medium hidden sm:block">{subtitle}</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600" />
              </span>
              <span className="text-[11px] font-semibold text-rose-400 tracking-wide">ADAPTIVE</span>
            </div>
          </div>
        )}

        {!subtitle && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600" />
            </span>
            <span className="text-[11px] font-semibold text-rose-400 tracking-wide">ADAPTIVE</span>
          </div>
        )}
      </div>
    </motion.header>
  );
}
