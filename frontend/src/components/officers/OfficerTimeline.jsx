import React from "react";
import { FaCheckCircle, FaHourglassHalf, FaCalendarDay } from "react-icons/fa";

const OfficerTimeline = ({ timeline }) => {
  if (!timeline) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-[4px] py-5 px-6 shadow-lg flex flex-col h-[420px]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <FaCalendarDay className="text-blue-400 text-sm" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Latest Investigation Activity
          </h2>
        </div>
        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-[9px] text-slate-400">
          Logs: CaseMaster
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-4">
        <div className="relative border-l-2 border-slate-800 pl-6 ml-3 space-y-8 py-2">
          
          {timeline.map((step, index) => {
            const isCompleted = step.status === "completed";
            
            return (
              <div key={index} className="relative group">
                {/* Node marker pin */}
                <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-[4px] bg-slate-950 border border-slate-800 text-[10px]">
                  {isCompleted ? (
                    <FaCheckCircle className="text-emerald-400" />
                  ) : (
                    <FaHourglassHalf className="text-amber-400 animate-spin text-[8px]" />
                  )}
                </span>

                {/* Content card */}
                <div className="bg-slate-950/40 hover:bg-slate-950/80 border border-slate-900 hover:border-slate-800 p-3 rounded-[4px] transition-all font-mono leading-normal text-[10px] space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className={`font-bold uppercase tracking-wider ${isCompleted ? "text-slate-200" : "text-amber-400 animate-pulse"}`}>
                      {step.stage}
                    </span>
                    <span className="text-slate-500 text-[8px]">{step.date}</span>
                  </div>
                  <p className="text-slate-400 font-sans leading-relaxed text-[10px] mt-0.5">
                    {step.desc}
                  </p>
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
