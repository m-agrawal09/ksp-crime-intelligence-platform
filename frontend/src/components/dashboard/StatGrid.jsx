import React from "react";
import {
  FaFolderOpen,
  FaSearch,
  FaGavel,
  FaUserLock
} from "react-icons/fa";
import StatCard from "./StatCard";

const StatGrid = ({ metrics }) => {
  if (!metrics) return null;

  const cardsData = [
    {
      title: "Total Registered FIRs",
      value: metrics.total_firs.value.toLocaleString("en-IN"),
      change: `${metrics.total_firs.change_percent >= 0 ? "+" : ""}${metrics.total_firs.change_percent}% from last month`,
      icon: FaFolderOpen,
      color: "text-blue-400",
      borderColor: "border-blue-500",
      dataSource: metrics.total_firs.source_table + "." + metrics.total_firs.source_field,
      coverage: metrics.total_firs.coverage,
      lastSync: metrics.total_firs.last_sync,
      subText: `Cognizable: ${metrics.total_firs.cognizable_count.toLocaleString("en-IN")}`
    },
    {
      title: "Active Investigations",
      value: metrics.active_investigations.value.toLocaleString("en-IN"),
      change: `${metrics.active_investigations.change_percent >= 0 ? "+" : ""}${metrics.active_investigations.change_percent}% from last month`,
      icon: FaSearch,
      color: "text-amber-400",
      borderColor: "border-amber-500",
      dataSource: metrics.active_investigations.source_table + " | " + metrics.active_investigations.source_field,
      coverage: metrics.active_investigations.coverage,
      lastSync: metrics.active_investigations.last_sync,
      subText: metrics.active_investigations.status_code
    },
    {
      title: "Charge-Sheet Rate (IIF-5)",
      value: `${metrics.charge_sheet_rate.value}%`,
      change: `+${metrics.charge_sheet_rate.change_percent}% vs last quarter`,
      icon: FaGavel,
      color: "text-emerald-400",
      borderColor: "border-emerald-500",
      dataSource: metrics.charge_sheet_rate.source_table + " | " + metrics.charge_sheet_rate.source_field,
      coverage: metrics.charge_sheet_rate.coverage,
      lastSync: metrics.charge_sheet_rate.last_sync,
      subText: "Final Report Type 'A'"
    },
    {
      title: "Suspect Arrest Rate (IIF-3)",
      value: `${metrics.apprehension_rate.value}%`,
      change: `+${metrics.apprehension_rate.change_percent}% YoY tracking`,
      icon: FaUserLock,
      color: "text-rose-400",
      borderColor: "border-rose-500",
      dataSource: metrics.apprehension_rate.source_table + " | " + metrics.apprehension_rate.source_field,
      coverage: metrics.apprehension_rate.coverage,
      lastSync: metrics.apprehension_rate.last_sync,
      subText: "Primary Accused Logs"
    }
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cardsData.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
          color={card.color}
          borderColor={card.borderColor}
          dataSource={card.dataSource}
          coverage={card.coverage}
          lastSync={card.lastSync}
          subText={card.subText}
        />
      ))}
    </div>
  );
};

export default StatGrid;