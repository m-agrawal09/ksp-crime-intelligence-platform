const PageHeader = ({ title, subtitle }) => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

      <div className="rounded-md border border-slate-800/30 bg-[#060c18] px-4 py-2.5 text-[11px] font-mono text-slate-400 shadow-sm self-start flex-shrink-0">
        {today}
      </div>
    </div>
  );
};

export default PageHeader;