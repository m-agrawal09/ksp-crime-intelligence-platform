import React from "react";
import {
  FaFolderOpen,
  FaSearch,
  FaCheckCircle,
  FaGavel,
  FaRegClock,
  FaUserLock
} from "react-icons/fa";

const OfficerKpis = ({ kpis }) => {
  if (!kpis) return null;

  const cardData = [
    {
      title: "Total Assigned",
      value: kpis.totalCases,
      color: "text-blue-400",
      borderColor: "border-blue-500",
      icon: FaFolderOpen
    },
    {
      title: "Active Tasks",
      value: kpis.activeCases,
      color: "text-amber-400",
      borderColor: "border-amber-500",
      icon: FaSearch
    },
    {
      title: "Cases Closed",
      value: kpis.closedCases,
      color: "text-emerald-400",
      borderColor: "border-emerald-500",
      icon: FaCheckCircle
    },
    {
      title: "Charge Rate (IIF-5)",
      value: `${kpis.chargesheetRate}%`,
      color: "text-purple-400",
      borderColor: "border-purple-500",
      icon: FaGavel
    },
    {
      title: "Avg Resolution",
      value: `${kpis.avgInvestigationTime} Days`,
      color: "text-cyan-400",
      borderColor: "border-cyan-500",
      icon: FaRegClock
    },
    {
      title: "Detection Rate",
      value: `${kpis.detectionRate}%`,
      color: "text-rose-400",
      borderColor: "border-rose-500",
      icon: FaUserLock
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cardData.map((card) => {
        const Icon = card.icon;
        
        return (
          <div
            key={card.title}
            className={`rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/90 border-l-4 ${card.borderColor} shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                {card.title}
              </span>
              <div className={`rounded-lg bg-slate-800/40 p-1.5 ${card.color}`}>
                <Icon className="text-xs" />
              </div>
            </div>
            <h2 className="mt-3 font-mono text-xl sm:text-2xl font-bold tracking-tight text-white">
              {card.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default OfficerKpis;
