/**
 * Acuity logo mark — a precision dial / aperture
 * Conveys: measurement, clarity, intelligence, calibration
 */
export default function Logo({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Acuity"
    >
      {/* Outer precision ring */}
      <circle cx="16" cy="16" r="14" stroke="#BE185D" strokeWidth="2" fill="none" />

      {/* Tick marks at cardinal points */}
      <line x1="16" y1="2"  x2="16" y2="6"  stroke="#BE185D" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="16" x2="26" y2="16" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="30" x2="16" y2="26" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" />
      <line x1="2"  y1="16" x2="6"  y2="16" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" />

      {/* Inner ring */}
      <circle cx="16" cy="16" r="8" stroke="#E11D48" strokeWidth="1.5" fill="none" opacity="0.35" />

      {/* Needle pointing to top-right (high score) */}
      <line x1="16" y1="16" x2="22" y2="8" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />

      {/* Center hub */}
      <circle cx="16" cy="16" r="2.5" fill="#BE185D" />
    </svg>
  );
}

/** Full wordmark — logo + "Acuity" text */
export function Wordmark({ size = 28, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo size={size} />
      <span
        className="font-black tracking-tight text-rose-900"
        style={{ fontSize: size * 0.75, lineHeight: 1 }}
      >
        Acuity
      </span>
    </div>
  );
}
