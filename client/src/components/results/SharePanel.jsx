import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ResultsCardModal from './ResultsCard.jsx';

export default function SharePanel({ iq, band, percentile, domains }) {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(false);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }} className="card p-6 no-print">
        <h3 className="font-bold text-rose-900 text-base mb-0.5">Share & Export</h3>
        <p className="text-xs text-rose-400 mb-5">Save your certificate, share to social, or print your report</p>

        {/* Quote */}
        <div className="bg-rose-50 rounded-2xl p-4 mb-5 border border-rose-100 text-center">
          <p className="text-sm text-rose-700 leading-relaxed">
            "I scored <strong className="text-rose-900">{iq}</strong> on the Acuity IQ Assessment —{' '}
            <strong className="text-rose-900">{band}</strong> · {percentile}th percentile"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Shareable card */}
          <button onClick={() => setShowCard(true)}
            className="btn-primary text-sm py-3 flex-col gap-1 h-auto items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold">Share Card</span>
          </button>

          {/* Print PDF */}
          <button onClick={() => window.print()} className="btn-secondary text-sm py-3 flex-col gap-1 h-auto items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="text-xs font-bold">Print PDF</span>
          </button>

          {/* Retake */}
          <button onClick={() => navigate('/')} className="btn-secondary text-sm py-3 flex-col gap-1 h-auto items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-xs font-bold">Retake</span>
          </button>
        </div>
      </motion.div>

      {/* Results card modal */}
      {showCard && (
        <ResultsCardModal
          iq={iq} band={band} percentile={percentile} domains={domains}
          onClose={() => setShowCard(false)}
        />
      )}
    </>
  );
}
