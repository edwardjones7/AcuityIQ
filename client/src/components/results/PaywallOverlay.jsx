export default function PaywallOverlay({ onPay, loading }) {
  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center rounded-3xl pt-12"
         style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,247,237,0.55)' }}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center border border-warm-100">
        {/* Lock icon */}
        <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-warm-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold text-warm-900 mb-2">Unlock Your Results</h2>
        <p className="text-warm-500 text-sm leading-relaxed mb-6">
          Get your full IQ score, domain breakdown, percentile ranking, and personalised cognitive analysis.
        </p>

        {/* What you get */}
        <ul className="text-left text-sm text-warm-700 space-y-2 mb-7">
          {[
            'Composite IQ score (normed, mean 100)',
            'Score breakdown across 4 domains',
            'Percentile rank vs general population',
            'In-depth written cognitive analysis',
            'Printable / shareable report',
          ].map(item => (
            <li key={item} className="flex items-center gap-2">
              <span className="text-warm-500 flex-shrink-0">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onPay}
          disabled={loading}
          className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Redirecting to payment...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Unlock Results — $1.99
            </>
          )}
        </button>

        <p className="text-xs text-warm-300 mt-3">Secure payment via Stripe · One-time charge</p>
      </div>
    </div>
  );
}
