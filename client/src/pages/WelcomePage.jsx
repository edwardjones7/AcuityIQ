import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wordmark } from '../components/Logo.jsx';

const DOMAINS = [
  { icon: '◈', label: 'Pattern Recognition', desc: 'Identify hidden rules across visual matrices and abstract sequences.', color: '#E11D48', bg: 'rgba(225,29,72,0.07)' },
  { icon: '◉', label: 'Verbal Reasoning',    desc: 'Analogies, logical deductions, and advanced vocabulary challenges.',  color: '#7C3AED', bg: 'rgba(124,58,237,0.07)' },
  { icon: '◇', label: 'Numerical Reasoning', desc: 'Number series, sequences, and quantitative problem solving.',           color: '#0369A1', bg: 'rgba(3,105,161,0.07)' },
  { icon: '◎', label: 'Spatial Reasoning',   desc: '3D visualisation, mental rotation, and shape manipulation.',            color: '#065F46', bg: 'rgba(6,95,70,0.07)' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-rose-50 relative overflow-hidden"
    >
      {/* Ambient blobs */}
      <div className="absolute top-[-160px] right-[-100px] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-2xl mx-auto px-5 pt-14 pb-20 flex flex-col items-center">
        <motion.div variants={container} initial="hidden" animate="show" className="w-full flex flex-col items-center">

          {/* Wordmark at top */}
          <motion.div variants={fadeUp} className="mb-8">
            <Wordmark size={32} />
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="badge">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Adaptive · Scientifically Normed · Trusted
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp} className="text-center mb-5">
            <h1 className="text-[3rem] sm:text-[4.2rem] md:text-[5.2rem] font-black tracking-tight leading-[0.95] text-rose-950 text-balance">
              Discover What<br />
              <span className="text-gradient-warm">Your Mind</span><br />
              Can Do.
            </h1>
          </motion.div>

          <motion.p variants={fadeUp} className="text-rose-400 text-base md:text-lg text-center leading-relaxed max-w-md mb-10">
            A 40-question adaptive assessment calibrated to your level in real time.
            Get a normed IQ score, four domain breakdowns, and a written cognitive analysis.
          </motion.p>

          {/* Stats pill */}
          <motion.div variants={fadeUp} className="flex items-center gap-0 mb-10 card-sm px-2 py-1 divide-x divide-rose-100">
            {[{ n: '40', label: 'Questions' }, { n: '4', label: 'Domains' }, { n: '~20', label: 'Minutes' }, { n: 'IQ', label: 'Score' }].map(s => (
              <div key={s.label} className="px-5 py-2.5 text-center">
                <div className="text-xl font-black text-rose-900 tabular-nums leading-none">{s.n}</div>
                <div className="text-[10px] font-semibold text-rose-400 uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Domain cards */}
          <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-10">
            {DOMAINS.map(d => (
              <motion.div key={d.label} variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.22, ease: 'easeOut' } }}
                className="card p-5 cursor-default group relative overflow-hidden"
              >
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full" style={{ backgroundColor: d.color }} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl font-black opacity-[0.05] pointer-events-none select-none group-hover:opacity-[0.09] group-hover:scale-110 transition-all duration-500"
                  style={{ color: d.color }}>{d.icon}</div>
                <div className="pl-4">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-base mb-3 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: d.bg, color: d.color }}>{d.icon}</div>
                  <p className="font-bold text-rose-900 text-sm mb-1">{d.label}</p>
                  <p className="text-rose-400 text-xs leading-relaxed">{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 w-full max-w-xs">
            <motion.button onClick={() => navigate('/test')}
              whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }}
              className="btn-primary w-full text-base py-4 justify-center">
              Begin Assessment
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
            <p className="text-xs text-rose-300">No account required · Results not stored</p>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
}
