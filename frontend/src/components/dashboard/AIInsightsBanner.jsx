import React from "react";
import { Link } from "react-router-dom";
import { RiBrainLine } from "react-icons/ri";
import { FaArrowRight, FaChartLine, FaClock, FaGavel } from "react-icons/fa";

const INSIGHTS = [
  {
    icon: FaChartLine,
    color:  "text-amber-400",
    bg:     "bg-amber-500/5",
    border: "border-amber-500/10",
    stat:   "+23%",
    statBg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    headline: "Cyber Fraud Surge",
    detail:   "Bengaluru & Mysuru clusters affected",
  },
  {
    icon: FaClock,
    color:  "text-blue-400",
    bg:     "bg-blue-500/5",
    border: "border-blue-500/10",
    stat:   "16:00 - 22:00",
    statBg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    headline: "Peak Crime Window",
    detail:   "Patrol density recommendation active",
  },
  {
    icon: FaGavel,
    color:  "text-emerald-400",
    bg:     "bg-emerald-500/5",
    border: "border-emerald-500/10",
    stat:   "+11.5%",
    statBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    headline: "Charge-Sheet Rate",
    detail:   "Q2 judicial submission efficiency",
  },
];

const AIInsightsBanner = () => (
  <div className="rounded-[4px] border border-slate-800/20 bg-slate-900/50 p-5 flex flex-col gap-4 animate-fade-in-up">

    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.18em] font-space">
        AI QuickML Tactical Briefing
      </h2>
      <RiBrainLine className="text-purple-400/70 text-sm animate-pulse" />
    </div>

    {/* Insight rows */}
    <div className="space-y-2.5">
      {INSIGHTS.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className={`flex items-center justify-between gap-3 p-3 rounded-[3px] border ${item.bg} ${item.border} transition-all duration-200 hover:brightness-110`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 ${item.color}`}>
                <Icon className="text-[12px]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-200 leading-snug font-space">
                  {item.headline}
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">
                  {item.detail}
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${item.statBg} whitespace-nowrap`}>
              {item.stat}
            </span>
          </div>
        );
      })}
    </div>

    {/* Footer link */}
    <Link
      to="/insights-forecast"
      className="flex items-center justify-center gap-1.5 w-full text-[9px] font-bold text-slate-500 hover:text-blue-400 transition-colors border-t border-slate-800/15 pt-3 uppercase tracking-[0.14em] font-space"
    >
      View All AI Insights <FaArrowRight className="text-[9px]" />
    </Link>
  </div>
);

export default AIInsightsBanner;
