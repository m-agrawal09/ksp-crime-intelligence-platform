const ChartCard = ({ title, subtitle, badge, children }) => {
  return (
    <div className="rounded-[4px] border border-slate-800/25 bg-slate-900/50 py-7 px-8">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {subtitle}
            </p>
          )}
        </div>

        {badge && (
          <span className="rounded-[3px] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-400">
            {badge}
          </span>
        )}
      </div>

      {children}
    </div>
  );
};

export default ChartCard;