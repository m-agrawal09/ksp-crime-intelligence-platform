const ChartCard = ({ title, subtitle, badge, action, className = "", children }) => {
  return (
    <div className={`rounded-[4px] border border-blue-500/30 bg-slate-900/50 px-8 pb-4 ${className}`} style={{ paddingTop: "12px" }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5 w-full">
        <div className="flex flex-col items-start">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300 font-space">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed font-space">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="flex-shrink-0">{action}</div>}

        {badge && (
          <span className="rounded-[3px] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 font-space">
            {badge}
          </span>
        )}
      </div>

      {children}
    </div>
  );
};

export default ChartCard;