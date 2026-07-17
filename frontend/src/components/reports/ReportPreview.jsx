import React from "react";
import { FaFilePdf, FaFileExcel, FaShareAlt, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";

const ReportPreview = ({ reportData, onExport, onShare, onSchedule }) => {
  if (!reportData) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-20 shadow-lg text-center flex flex-col items-center justify-center gap-3 text-slate-500 font-mono text-xs">
        <FaShieldAlt className="text-3xl text-slate-700 animate-pulse" />
        <span>Awaiting parameter compilation. Click 'Preview Report' to generate.</span>
      </div>
    );
  }

  const { title, subtitle, classification, date, meta, summary, kpis, findings, recommendations } = reportData;

  const doubleBorder = "border-t-4 border-double border-slate-700 my-6";

  return (
    <div className="space-y-6">
      
      {/* 1. Confidential Document Sheet */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 sm:p-12 max-w-3xl mx-auto shadow-2xl relative overflow-hidden font-mono text-xs text-slate-300 leading-relaxed selection:bg-blue-500/20">
        
        {/* Security Watermark Stamp */}
        <div className="absolute top-8 right-8 border-2 border-red-500/40 text-red-500/50 font-bold uppercase tracking-widest text-[9px] px-2.5 py-1 rotate-12 select-none pointer-events-none rounded">
          {classification}
        </div>

        {/* Header Cover */}
        <div className="text-center space-y-2 mt-4">
          <span className="text-slate-500 text-[10px] tracking-widest uppercase font-bold">
            KARNATAKA STATE POLICE
          </span>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-widest uppercase mt-2">
            {title}
          </h1>
          <p className="text-slate-400 text-[10px] tracking-widest uppercase">
            {subtitle}
          </p>
        </div>

        <div className={doubleBorder} />

        {/* Cover Meta Parameters */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-[10px] border-b border-slate-900 pb-4 mb-6">
          <div>
            <span className="text-slate-500 block uppercase text-[8px]">DOCUMENT DATE:</span>
            <span className="text-slate-200 font-bold">{date}</span>
          </div>
          <div>
            <span className="text-slate-550 block uppercase text-[8px]">CLASSIFICATION RANK:</span>
            <span className="text-red-400 font-bold uppercase">{classification}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[8px]">JURISDICTION SCOPE:</span>
            <span className="text-slate-200 font-bold uppercase">{meta.district}</span>
          </div>
          <div>
            <span className="text-slate-550 block uppercase text-[8px]">CRIME VECTOR HEAD:</span>
            <span className="text-slate-200 font-bold uppercase">{meta.category}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[8px]">ACTIVE OFFICER CONTEXT:</span>
            <span className="text-slate-200 font-bold uppercase">{meta.officer}</span>
          </div>
          <div>
            <span className="text-slate-550 block uppercase text-[8px]">TEMPORAL BOUNDS:</span>
            <span className="text-slate-200 font-bold uppercase">{meta.dateRange}</span>
          </div>
        </div>

        {/* 2. Executive Summary */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
            I. EXECUTIVE SUMMARY
          </span>
          <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
            {summary}
          </p>
        </div>

        <div className={doubleBorder} />

        {/* 3. KPI Highlights / Summary stats */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
            II. KEY METRIC AGGREGATIONS
          </span>
          <div className="grid grid-cols-3 gap-4 text-center bg-slate-900/20 border border-slate-900 p-4 rounded-xl">
            {kpis.map((kpi, idx) => (
              <div key={idx}>
                <span className="text-[8px] text-slate-500 block uppercase">{kpi.label}</span>
                <span className="text-base font-bold text-white block mt-1">{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={doubleBorder} />

        {/* 4. Core Findings */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
            III. INVESTIGATIVE FINDINGS
          </span>
          <div className="space-y-2.5 pl-2">
            {findings.map((finding, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-300">
                <span className="text-blue-500 font-bold">{idx + 1}.</span>
                <span className="font-sans">{finding}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={doubleBorder} />

        {/* 5. Command Recommendations */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
            IV. STRATEGIC RECOMMENDATIONS
          </span>
          <div className="space-y-2.5 pl-2">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-350">
                <span className="text-red-500 font-bold font-mono">●</span>
                <span className="font-sans">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-dashed border-slate-800 my-8" />

        {/* Signatures */}
        <div className="flex justify-between items-end pt-2 text-[8px] text-slate-500 font-mono">
          <div>
            <span>SYSTEM ENCRYPTED: MD5_AIP_LOG</span>
            <span className="block mt-0.5">KSP DATASTORE HANDSHAKE COMPLETED</span>
          </div>
          <div className="text-right uppercase border-t border-slate-800 pt-1.5 w-36">
            <span>COMMAND OFFICER</span>
          </div>
        </div>

      </div>

      {/* 2. Actions Strip (PDF, Excel, Share, Schedule) */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-wrap gap-3 justify-center items-center max-w-3xl mx-auto shadow-md">
        <button
          onClick={() => onExport("PDF")}
          className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          <FaFilePdf className="text-xs" />
          EXPORT PDF
        </button>
        <button
          onClick={() => onExport("EXCEL")}
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          <FaFileExcel className="text-xs" />
          EXPORT EXCEL
        </button>
        <button
          onClick={onShare}
          className="flex items-center justify-center gap-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 font-mono font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          <FaShareAlt className="text-xs" />
          SHARE REPORT
        </button>
        <button
          onClick={onSchedule}
          className="flex items-center justify-center gap-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 font-mono font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          <FaCalendarAlt className="text-xs" />
          SCHEDULE COMPILATION
        </button>
      </div>

    </div>
  );
};

export default ReportPreview;
