import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { iqBandColor, DOMAIN_LABELS, DOMAIN_COLORS } from '../../utils/scoring.js';

/**
 * Shareable results card — designed to look beautiful as a screenshot.
 * Fixed 400×500 dimensions, no blur/backdrop-filter (html2canvas compatible).
 */
export function ShareCard({ iq, band, percentile, domains, forwardRef }) {
  const color = iqBandColor(iq);

  const domainEntries = Object.entries(domains).map(([key, d]) => ({
    key,
    label: DOMAIN_LABELS[key].split(' ')[0],
    iq: d.iq,
    color: DOMAIN_COLORS[key],
  }));

  return (
    <div
      ref={forwardRef}
      style={{
        width: 400,
        height: 500,
        background: 'linear-gradient(145deg, #FDF8F9 0%, #FAF0F3 50%, #FDF8F9 100%)',
        borderRadius: 24,
        padding: '40px 36px',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid #F2DADE',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background watermark */}
      <div style={{
        position: 'absolute', right: -20, top: -20,
        fontSize: 220, fontWeight: 900, color: '#E11D48', opacity: 0.03,
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        fontFamily: 'Inter, sans-serif',
      }}>
        {iq}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Inline logo mark */}
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#BE185D" strokeWidth="2" />
            <line x1="16" y1="2"  x2="16" y2="6"  stroke="#BE185D" strokeWidth="2" strokeLinecap="round" />
            <line x1="30" y1="16" x2="26" y2="16" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="30" x2="16" y2="26" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" />
            <line x1="2"  y1="16" x2="6"  y2="16" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="16" r="8" stroke="#E11D48" strokeWidth="1.5" opacity="0.35" />
            <line x1="16" y1="16" x2="22" y2="8" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="16" r="2.5" fill="#BE185D" />
          </svg>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#360511', letterSpacing: '-0.02em' }}>
            Acuity
          </span>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, color: '#BC6680',
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          Cognitive Assessment
        </span>
      </div>

      {/* Score */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: '#BC6680',
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8,
        }}>
          IQ Score
        </div>
        <div style={{
          fontSize: 96, fontWeight: 900, lineHeight: 1,
          color, fontVariantNumeric: 'tabular-nums',
        }}>
          {iq}
        </div>
        <div style={{
          display: 'inline-block', marginTop: 12, padding: '6px 18px',
          borderRadius: 100, fontSize: 13, fontWeight: 700,
          backgroundColor: `${color}14`, color, border: `1px solid ${color}30`,
        }}>
          {band}
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: '#9B3A58' }}>
          Higher than <strong style={{ color: '#360511' }}>{percentile}%</strong> of the population
        </div>
      </div>

      {/* Domain mini bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
        {domainEntries.map(d => (
          <div key={d.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#9B3A58' }}>{d.label}</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: d.color }}>{d.iq}</span>
            </div>
            <div style={{ height: 3, backgroundColor: '#F2DADE', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${Math.max(5, ((d.iq - 60) / 100) * 100)}%`,
                background: d.color,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', fontSize: 10, color: '#D494A6',
        borderTop: '1px solid #F2DADE', paddingTop: 14,
      }}>
        acuity.ai · Scientifically normed · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
      </div>
    </div>
  );
}

/** Wrapper with modal + download button */
export default function ResultsCardModal({ iq, band, percentile, domains, onClose }) {
  const cardRef = useRef(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `acuity-iq-${iq}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(26,8,18,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          className="flex flex-col items-center gap-5"
        >
          {/* The card itself */}
          <ShareCard
            iq={iq} band={band} percentile={percentile} domains={domains}
            forwardRef={cardRef}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2.5 px-6">
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Save Image
                </>
              )}
            </button>
            <button onClick={onClose} className="btn-secondary text-sm py-2.5 px-5">Close</button>
          </div>
          <p className="text-xs text-rose-300/70">Share to Instagram, TikTok, or LinkedIn</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
