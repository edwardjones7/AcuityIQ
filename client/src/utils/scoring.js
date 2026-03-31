export const DOMAIN_LABELS = {
  pattern:   'Pattern Recognition',
  verbal:    'Verbal Reasoning',
  numerical: 'Numerical Reasoning',
  spatial:   'Spatial Reasoning',
};

// Vivid, distinct — chosen to harmonise with the rose/mauve palette
export const DOMAIN_COLORS = {
  pattern:   '#E11D48', // rose-600
  verbal:    '#7C3AED', // violet-700
  numerical: '#0369A1', // sky-700
  spatial:   '#065F46', // emerald-900
};

export const DOMAIN_ICONS = {
  pattern:   '◈',
  verbal:    '◉',
  numerical: '◇',
  spatial:   '◎',
};

export const DOMAIN_BG = {
  pattern:   'rgba(225,29,72,0.07)',
  verbal:    'rgba(124,58,237,0.07)',
  numerical: 'rgba(3,105,161,0.07)',
  spatial:   'rgba(6,95,70,0.07)',
};

export function iqBandColor(iq) {
  if (iq >= 130) return '#065F46'; // emerald
  if (iq >= 120) return '#0369A1'; // blue
  if (iq >= 110) return '#7C3AED'; // violet
  if (iq >= 90)  return '#BE185D'; // rose/mauve
  if (iq >= 80)  return '#E11D48'; // rose-hot
  return '#9F1239';                // deep crimson
}

export function percentileLabel(pct) {
  if (pct >= 99) return 'Top 1%';
  if (pct >= 95) return 'Top 5%';
  if (pct >= 90) return 'Top 10%';
  if (pct >= 75) return 'Top 25%';
  if (pct >= 50) return 'Above Average';
  if (pct >= 25) return 'Below Average';
  return `Bottom ${pct}%`;
}

export function formatAccuracy(rawAccuracy) {
  return `${Math.round(rawAccuracy * 100)}%`;
}
