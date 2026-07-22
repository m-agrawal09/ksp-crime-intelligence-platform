const ChartCard = ({ title, subtitle, badge, className = "", children }) => {
  return (
    <div className={`rounded-[4px] border border-blue-500/30 bg-slate-900/50 py-7 px-8 ${className}`}>
      <div className="mb-7 flex flex-col items-center justify-center text-center w-full gap-1.5">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300 font-space w-full text-center">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed font-space w-full text-center">
            {subtitle}
          </p>
        )}

        {badge && (
          <span className="rounded-[3px] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 font-space mt-1">
            {badge}
          </span>
        )}
      </div>

      {children}
    </div>
  );
};

export default ChartCard;