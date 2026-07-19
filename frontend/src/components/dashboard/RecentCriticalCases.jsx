import React, { useState } from "react";
import { FaShieldAlt, FaCalendarAlt, FaUser, FaClipboardList, FaAngleDown, FaAngleUp } from "react-icons/fa";

const RecentCriticalCases = ({ cases }) => {
  const [expandedCaseId, setExpandedCaseId] = useState(null);

  const toggleExpand = (caseId) => {
    setExpandedCaseId(expandedCaseId === caseId ? null : caseId);
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-400 border border-red-500/20 font-bold";
      case "HIGH":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold";
      case "MEDIUM":
      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Charge-sheet Submitted":
        return "text-emerald-400 bg-emerald-500/5 border border-emerald-500/15";
      case "Suspect Apprehended":
        return "text-blue-400 bg-blue-500/5 border border-blue-500/15";
      case "Under Investigation":
      default:
        return "text-amber-400 bg-amber-500/5 border border-amber-500/15";
    }
  };

  return (
    <div className="rounded-[4px] border border-slate-800 bg-slate-900/60 p-6 sm:p-8 flex flex-col h-[500px] shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <FaClipboardList className="text-blue-400 text-lg" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Critical CCTNS Case Feed
          </h2>
        </div>
        <span className="rounded-full bg-slate-800 px-3 py-1 font-mono text-[10px] text-slate-400">
          Source: CaseMaster
        </span>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-4">Crime Number / CaseNo</th>
              <th className="py-4 px-4">Jurisdiction (Unit)</th>
              <th className="py-4 px-4">Sections & Acts</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-right">Risk Index</th>
              <th className="py-4 px-4 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-xs font-mono">
            {cases && cases.map((c) => {
              const isExpanded = expandedCaseId === c.CaseMasterID;
              
              return (
                <React.Fragment key={c.CaseMasterID}>
                  {/* Standard Row */}
                  <tr className="hover:bg-slate-800/30 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {c.CaseNo}
                      </div>
                      <div className="text-[9px] text-slate-500 mt-1 select-all">
                        {c.CrimeNo}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      <div>{c.UnitName.replace(" Police Station", " PS")}</div>
                      <div className="text-[9px] text-slate-500 mt-1">{c.DistrictName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-slate-300 max-w-[280px] truncate" title={c.act_sections}>
                        {c.act_sections}
                      </div>
                      <div className="text-[9px] text-slate-500 mt-1 flex items-center gap-1.5">
                        <FaCalendarAlt className="text-[8px]" /> Filed: {c.CrimeRegisteredDate}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] tracking-wide ${getStatusColor(c.CaseStatusName)}`}>
                        {c.CaseStatusName}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`rounded px-1.5 py-0.5 text-[9px] tracking-wider ${getRiskBadge(c.risk_index)}`}>
                        {c.risk_index}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => toggleExpand(c.CaseMasterID)}
                        className="p-1 rounded bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors"
                      >
                        {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Inspector Drawer */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="bg-slate-950/80 px-6 py-5 border-l-4 border-l-blue-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px] leading-relaxed text-slate-300">
                          {/* Case Briefing */}
                          <div className="md:col-span-2 space-y-2">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                              Case Briefing (BriefFacts)
                            </span>
                            <p className="text-slate-400 bg-slate-900/40 p-3 rounded border border-slate-900">
                              {c.BriefFacts}
                            </p>
                          </div>

                          {/* Operational Assignments */}
                          <div className="space-y-3 bg-slate-900/20 p-3 rounded border border-slate-900/50">
                            <div>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                                Investigating Officer (IO)
                              </span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <FaUser className="text-[10px] text-slate-400" />
                                <span className="text-slate-300 font-bold">{c.investigating_officer.RankName} {c.investigating_officer.FirstName}</span>
                              </div>
                              <span className="text-[9px] text-slate-500 block pl-4">KGID: {c.investigating_officer.KGID}</span>
                            </div>

                            <div className="border-t border-slate-850 pt-2.5">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                                Suspects / Accused
                              </span>
                              <div className="mt-1 space-y-1">
                                {c.suspects.map((s) => (
                                  <div key={s.AccusedMasterID} className="flex items-center justify-between">
                                    <span className="text-slate-300 font-semibold">{s.PersonID}: {s.AccusedName}</span>
                                    <span className={`text-[9px] px-1.5 rounded ${
                                      s.ApprehensionStatus === "Detained" || s.ApprehensionStatus === "Judicial Custody"
                                        ? "text-emerald-400 bg-emerald-500/5"
                                        : "text-rose-400 bg-rose-500/5"
                                    }`}>
                                      {s.ApprehensionStatus}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCriticalCases;
