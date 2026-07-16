const StatCard = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-200 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-900/20">
      <div className="flex items-center justify-between">
        <div className="text-slate-400">{title}</div>

        <Icon className={`text-2xl ${color}`} />
      </div>

      <h2 className="mt-4 text-3xl font-bold text-white">{value}</h2>

      <p className="mt-2 text-sm text-emerald-400">{change}</p>
    </div>
  );
};

export default StatCard;