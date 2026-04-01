import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { captureEmail } from '../../services/api.js';

const FEATURES = [
  'Composite IQ score (normed, mean 100)',
  'Breakdown across 4 cognitive domains',
  'Percentile rank vs. the general population',
  'Written cognitive profile & analysis',
  'Printable certificate & shareable card',
];

export default function PaywallOverlay({ onPay, loading, iq, band, percentile }) {
  const [email, setEmail]           = useState('');
  const [emailSent, setEmailSent]   = useState(false);
  const [emailError, setEmailError] = useState('');
  const [sendingEmail, setSending]  = useState(false);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    if (!email.includes('@')) { setEmailError('Enter a valid email'); return; }
    setSending(true);
    setEmailError('');
    try {
      await captureEmail({ email, iq, band, percentile });
      setEmailSent(true);
    } catch {
      // silent fail — don't block payment
      setEmailSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex items-start justify-center pt-8 px-4"
      style={{
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        backgroundColor: 'rgba(253,248,249,0.84)',
        borderRadius: '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="card p-8 max-w-sm w-full text-center"
        style={{ boxShadow: '0 24px 80px rgba(90,20,40,0.2), 0 8px 32px rgba(90,20,40,0.1)' }}
      >
        {/* Floating lock */}
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </motion.div>

        <h2 className="text-2xl font-extrabold text-rose-950 mb-1.5">Unlock Your Results</h2>
        <p className="text-rose-400 text-sm leading-relaxed mb-5">
          Full IQ score, cognitive profile, certificate & shareable card.
        </p>

        {/* Feature list */}
        <ul className="text-left space-y-2.5 mb-6">
          {FEATURES.map((f, i) => (
            <motion.li key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              className="flex items-center gap-3 text-sm text-rose-700">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {f}
            </motion.li>
          ))}
        </ul>

        {/* Email capture */}
        <div className="mb-4">
          <AnimatePresence mode="wait">
            {!emailSent ? (
              <motion.form key="form" onSubmit={handleEmailSubmit}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                  placeholder="your@email.com"
                  className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-rose-200 bg-white text-rose-900 placeholder-rose-300 focus:outline-none focus:border-rose-400 transition-colors"
                />
                <button type="submit" disabled={sendingEmail}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors flex-shrink-0">
                  {sendingEmail ? '...' : 'Save'}
                </button>
              </motion.form>
            ) : (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 border border-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-semibold text-green-700">Email saved</span>
              </motion.div>
            )}
          </AnimatePresence>
          {emailError && <p className="text-xs text-rose-500 mt-1.5">{emailError}</p>}
          {!emailSent && <p className="text-[10px] text-rose-300 mt-1.5">Optional — receive your results by email too</p>}
        </div>

        {/* Pay CTA */}
        <motion.button onClick={onPay} disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.97 } : {}}
          className="btn-primary w-full text-base py-4">
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Redirecting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Unlock Full Report — $2.99
            </>
          )}
        </motion.button>

        <p className="text-xs text-rose-300 mt-3">Secure payment via Stripe · One-time charge</p>
      </motion.div>
    </motion.div>
  );
}
