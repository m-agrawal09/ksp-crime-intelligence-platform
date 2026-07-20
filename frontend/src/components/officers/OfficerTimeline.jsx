import React from "react";
import { FaCheckCircle, FaHourglassHalf, FaCalendarDay } from "react-icons/fa";

const OfficerTimeline = ({ timeline }) => {
  if (!timeline) return null;

  // Render relative time helper (simple mapping for presentation)
  const getRelativeDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const diffMs = Date.now() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return dateStr;
  };

  return (
    <div className="bg-slate-900/35 border border-slate-800/35 rounded-xl py-6 px-7 shadow-lg flex flex-col h-[420px]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/20 pb-3.5 mb-5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <FaCalendarDay className="text-blue-400 text-xs" />
          <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.14em] font-mono">
            Latest Investigation Activity
          </h2>
        </div>
        <span className="rounded-full bg-slate-950 border border-slate-800/50 px-2.5 py-0.5 font-mono text-[8px] text-slate-500 uppercase tracking-wider">
          Logs: CaseMaster
        </span>
      </div>

      {/* Timeline track list */}
      <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin">
        <div className="relative border-l border-slate-800/50 pl-6 ml-3 space-y-6 py-1">
          
          {timeline.map((step, index) => {
            const isCompleted = step.status === "completed";
            
            return (
              <div key={index} className="relative group">
                
                {/* Timeline node dot indicator */}
                <span className="absolute -left-[30.5px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-950 border border-slate-800 z-10">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    isCompleted ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-amber-400 animate-pulse"
                  }`} />
                </span>

                {/* Content block: spacing, typography, subtle separator line */}
                <div className="flex flex-col gap-1 text-[10px] font-mono leading-normal pb-4 border-b border-slate-800/15">
                  
                  {/* Title & relative date */}
                  <div className="flex justify-between items-center gap-2">
                    <span className={`font-bold uppercase tracking-wider text-[9.5px] ${
                      isCompleted ? "text-slate-200" : "text-amber-400 animate-pulse"
                    }`}>
                      {step.stage}
                    </span>
                    <span className="text-slate-500 text-[8px]">{getRelativeDate(step.date)}</span>
                  </div>

                  {/* Officer action details */}
                  <p className="text-slate-400 font-sans leading-relaxed text-[9.5px] mt-0.5">
                    {step.desc}
                  </p>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[7.5px] text-slate-500 uppercase tracking-widest">Status:</span>
                    <span className={`text-[7.5px] uppercase tracking-wider font-bold ${
                      isCompleted ? "text-emerald-500" : "text-amber-400"
                    }`}>
                      {isCompleted ? "Completed Action" : "In Progress"}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
};

export default OfficerTimeline;
