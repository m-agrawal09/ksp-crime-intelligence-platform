import { useState, useEffect } from "react";

const PageHeader = ({ title, subtitle }) => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const liveLabel =
    secondsAgo < 60
      ? `Updated ${secondsAgo}s ago`
      : `Updated ${Math.floor(secondsAgo / 60)}m ago`;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between animate-fade-in-up">
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
          {title}
        </h1>

        <p className="mt-2.5 text-sm text-slate-500 font-sans leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      </div>

      {/* Right meta group */}
      <div className="flex items-center gap-2.5 self-start flex-shrink-0">
        {/* Live status badge */}
        <div className="flex items-center gap-2 rounded-md border border-emerald-800/30 bg-emerald-950/30 px-3 py-2 text-[10px] font-mono">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="font-bold text-emerald-400 tracking-wider">LIVE</span>
            <span className="text-emerald-700 mt-0.5 text-[8px]">{liveLabel}</span>
          </div>
        </div>

        {/* Date badge */}
        <div className="rounded-md border border-slate-800/30 bg-[#060c18] px-4 py-2.5 text-[11px] font-mono text-slate-400 shadow-sm">
          {today}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;