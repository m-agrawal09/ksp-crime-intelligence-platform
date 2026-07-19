const ChartCard = ({ title, subtitle, badge, children }) => {
  return (
    <div className="rounded-[4px] border border-slate-800 bg-slate-900 py-5 px-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {badge && (
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-400">
            {badge}
          </span>
        )}
      </div>

      {children}
    </div>
  );
};

export default ChartCard;