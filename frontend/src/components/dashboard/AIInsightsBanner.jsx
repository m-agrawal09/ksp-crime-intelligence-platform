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
    headline: "Cyber fraud cases up 23% in last 30 days",
    detail:   "Bengaluru, Mysuru & Mangaluru most affected",
  },
  {
    icon: FaClock,
    color:  "text-blue-400",
    bg:     "bg-blue-500/5",
    border: "border-blue-500/10",
    headline: "Evening hours show peak crime frequency",
    detail:   "4 PM – 10 PM window requires increased patrolling",
  },
  {
    icon: FaGavel,
    color:  "text-emerald-400",
    bg:     "bg-emerald-500/5",
    border: "border-emerald-500/10",
    headline: "Charge-sheet rate improved 11.5% this quarter",
    detail:   "Excellent performance across all ranges",
  },
];

const AIInsightsBanner = () => (
  <div className="rounded-[4px] border border-slate-800/20 bg-slate-900/50 p-5 flex flex-col gap-4 animate-fade-in-up">

    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.18em]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        AI-Powered Insights
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
            className={`flex items-start gap-3 p-3 rounded-[3px] border ${item.bg} ${item.border} transition-all duration-200 hover:brightness-110`}
          >
            <div className={`flex-shrink-0 mt-0.5 ${item.color}`}>
              <Icon className="text-[11px]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-300 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {item.headline}
              </p>
              <p className="text-[9px] text-slate-600 mt-0.5 leading-relaxed" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {item.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>

    {/* Footer link */}
    <Link
      to="/insights-forecast"
      className="flex items-center justify-center gap-1.5 w-full text-[9px] font-bold text-slate-600 hover:text-blue-400 transition-colors border-t border-slate-800/15 pt-3 uppercase tracking-[0.14em]"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      View All AI Insights <FaArrowRight className="text-[9px]" />
    </Link>
  </div>
);

export default AIInsightsBanner;
