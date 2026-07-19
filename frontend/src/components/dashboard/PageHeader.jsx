const PageHeader = ({ title, subtitle }) => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>

        <p className="mt-1 text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="rounded-[4px] border border-slate-800 bg-[#081220] px-4 py-2.5 text-xs font-mono text-slate-400 shadow-sm">
        {today}
      </div>
    </div>
  );
};

export default PageHeader;