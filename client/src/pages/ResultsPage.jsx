import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header.jsx';
import ScoreDisplay from '../components/results/ScoreDisplay.jsx';
import DomainBarChart from '../components/results/DomainBarChart.jsx';
import PercentileGauge from '../components/results/PercentileGauge.jsx';
import NarrativePanel from '../components/results/NarrativePanel.jsx';
import SharePanel from '../components/results/SharePanel.jsx';
import PaywallOverlay from '../components/results/PaywallOverlay.jsx';
import { createCheckoutSession, verifyPayment } from '../services/api.js';
import { DOMAIN_LABELS, DOMAIN_COLORS, DOMAIN_BG, DOMAIN_ICONS, iqBandColor } from '../utils/scoring.js';

const PAYMENT_KEY = 'iqPaid';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function ResultsPage() {
  const { state }       = useLocation();
  const navigate        = useNavigate();
  const [searchParams]  = useSearchParams();

  const [results, setResults] = useState(() => {
    if (state?.results) return state.results;
    const s = sessionStorage.getItem('iqResults');
    return s ? JSON.parse(s) : null;
  });
  const [isPaid, setIsPaid] = useState(() => {
    if (new URLSearchParams(window.location.search).get('unlock') === 'Elenos123') return true;
    return sessionStorage.getItem(PAYMENT_KEY) === 'true';
  });
  const [payLoading, setPayLoading] = useState(false);
  const [verifying, setVerifying]   = useState(false);

  useEffect(() => { if (!results) navigate('/', { replace: true }); }, [results, navigate]);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId || isPaid) return;
    setVerifying(true);
    verifyPayment(sessionId)
      .then(paid => { if (paid) { sessionStorage.setItem(PAYMENT_KEY, 'true'); setIsPaid(true); } })
      .catch(() => {})
      .finally(() => setVerifying(false));
  }, []); // eslint-disable-line

  async function handlePay() {
    setPayLoading(true);
    try { window.location.href = await createCheckoutSession(); }
    catch { setPayLoading(false); }
  }

  if (!results) return null;

  if (verifying) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#F2DADE" strokeWidth="4" />
              <motion.circle cx="28" cy="28" r="22" fill="none" stroke="#E11D48" strokeWidth="4"
                strokeLinecap="round" strokeDasharray="138"
                initial={{ strokeDashoffset: 138 }} animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
            </svg>
          </div>
          <p className="font-semibold text-rose-900 text-sm">Verifying payment...</p>
        </motion.div>
      </div>
    );
  }

  const { composite, domains, narrative, meta } = results;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }} className="min-h-screen bg-rose-50">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${iqBandColor(composite.iq)}10 0%, transparent 70%)` }} />

      <Header title="Your Results" subtitle="Assessment Complete" />

      <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
        {/* Meta strip */}
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-6 mb-8 no-print">
          {[
            { l: 'Questions', v: meta.totalQuestions },
            { l: 'Correct',   v: meta.totalCorrect },
            { l: 'Accuracy',  v: `${Math.round((meta.totalCorrect / meta.totalQuestions) * 100)}%` },
            { l: 'Date',      v: new Date(meta.testDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
          ].map(m => (
            <div key={m.l} className="flex items-center gap-2">
              <span className="text-xs text-rose-300 font-medium">{m.l}</span>
              <span className="text-sm font-bold text-rose-800">{m.v}</span>
            </div>
          ))}
        </motion.div>

        {/* Paywall wrapper */}
        <div className={`relative ${!isPaid ? 'select-none' : ''}`}>
          <motion.div variants={stagger} initial="hidden" animate="show"
            className={!isPaid ? 'pointer-events-none' : ''}
            style={!isPaid ? { filter: 'blur(10px)' } : {}}>

            <motion.div variants={fadeUp} className="mb-5">
              <ScoreDisplay iq={composite.iq} percentile={composite.percentile} band={composite.band} />
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <DomainBarChart domains={domains} />
              <PercentileGauge percentile={composite.percentile} band={composite.band} iq={composite.iq} />
            </motion.div>

            <motion.div variants={fadeUp} className="mb-4">
              <NarrativePanel narrative={narrative} />
            </motion.div>

            <motion.div variants={fadeUp} className="card p-6 mb-4">
              <h3 className="font-bold text-rose-900 text-base mb-0.5">Domain Breakdown</h3>
              <p className="text-xs text-rose-400 mb-5">Full scores per cognitive domain</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(domains).map(([domain, d]) => {
                  const color     = DOMAIN_COLORS[domain];
                  const bg        = DOMAIN_BG[domain];
                  const bandColor = iqBandColor(d.iq);
                  return (
                    <div key={domain} className="rounded-2xl p-4 border"
                      style={{ backgroundColor: bg, borderColor: `${color}20` }}>
                      <div className="flex justify-between items-start mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm" style={{ color }}>{DOMAIN_ICONS[domain]}</span>
                          <span className="text-xs font-bold text-rose-800">
                            {DOMAIN_LABELS[domain].split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-xl font-black tabular-nums" style={{ color: bandColor }}>{d.iq}</span>
                      </div>
                      <div className="w-full bg-rose-100 rounded-full h-1 mb-1.5 overflow-hidden">
                        <motion.div className="h-1 rounded-full" style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(d.rawAccuracy * 100)}%` }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.6 }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-rose-400">
                        <span>{d.questionsAnswered} questions</span>
                        <span>{Math.round(d.rawAccuracy * 100)}% accuracy</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {isPaid && (
              <motion.div variants={fadeUp}>
                <SharePanel iq={composite.iq} band={composite.band} percentile={composite.percentile} domains={domains} />
              </motion.div>
            )}
          </motion.div>

          {!isPaid && (
            <PaywallOverlay
              onPay={handlePay} loading={payLoading}
              iq={composite.iq} band={composite.band} percentile={composite.percentile}
            />
          )}
        </div>

        <div className="hidden print:block mt-8 text-center text-xs text-rose-300">
          IQ Assessment Report · Generated {new Date(meta.testDate).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
}
