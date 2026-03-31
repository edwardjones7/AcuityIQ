export default function Timer({ formatted }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100/70 border border-rose-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-mono text-xs font-bold text-rose-600 tabular-nums">{formatted}</span>
    </div>
  );
}
