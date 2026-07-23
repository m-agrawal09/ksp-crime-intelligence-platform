import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import FIRFormModal from "../../components/records/FIRFormModal";
import FIRDetailModal from "../../components/records/FIRDetailModal";
import PINVerificationModal from "../../components/records/PINVerificationModal";
import { recordService } from "../../services/recordService";
import { useLanguage } from "../../context/LanguageContext";
import {
  FaFolderPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaUndo,
  FaFilter,
  FaShieldAlt,
  FaUserCheck,
  FaExclamationTriangle
} from "react-icons/fa";

const ManageRecords = () => {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    district: "",
    category: "",
    severity: "",
    status: ""
  });

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // PIN Authorization States
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinActionCallback, setPinActionCallback] = useState(null);
  const [pinActionTitle, setPinActionTitle] = useState("");

  const requestPinAuth = (title, callback) => {
    setPinActionTitle(title);
    setPinActionCallback(() => callback);
    setIsPinModalOpen(true);
  };

  // Load records on mount & filter change
  const reloadRecords = () => {
    const data = recordService.getRecords(filters);
    setRecords(data);
  };

  useEffect(() => {
    reloadRecords();

    // Fetch remote records from Catalyst backend and subscribe to updates
    recordService.fetchRemoteRecords().then(() => {
      reloadRecords();
    });

    const unsubscribe = recordService.subscribe(() => {
      reloadRecords();
    });

    return () => unsubscribe();
  }, [filters]);

  // Derived Statistics
  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter((r) => r.status !== "Case Closed / Completed").length;
    const closed = records.filter((r) => r.status === "Case Closed / Completed").length;
    const critical = records.filter((r) => r.severity === "CRITICAL").length;
    return { total, active, closed, critical };
  }, [records]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      district: "",
      category: "",
      severity: "",
      status: ""
    });
  };

  const handleOpenCreateModal = () => {
    requestPinAuth(t("authFileFir", "Authorization Required: File New FIR"), () => {
      setSelectedRecord(null);
      setIsFormOpen(true);
    });
  };

  const handleOpenEditModal = (rec) => {
    requestPinAuth(t("authEditFir", `Authorization Required: Edit FIR #${rec.crimeNo || rec.id}`), () => {
      setSelectedRecord(rec);
      setIsFormOpen(true);
    });
  };

  const handleViewDetail = (rec) => {
    setSelectedRecord(rec);
    setIsDetailOpen(true);
  };

  const handleSaveRecord = async (formData) => {
    if (selectedRecord && selectedRecord.id) {
      await recordService.updateRecord(selectedRecord.id, formData);
    } else {
      await recordService.createRecord(formData);
    }
    setIsFormOpen(false);
    setSelectedRecord(null);
    reloadRecords();
  };

  const handleToggleStatus = (rec) => {
    const isCurrentlyClosed = rec.status === "Case Closed / Completed";
    const actionLabel = isCurrentlyClosed ? t("reopenCase", "Reopen Case") : t("markClosed", "Mark Case Closed");
    requestPinAuth(t("authToggleStatus", `Authorization Required: ${actionLabel}`), () => {
      recordService.toggleCaseClosed(rec.id);
      reloadRecords();
      if (selectedRecord && selectedRecord.id === rec.id) {
        setSelectedRecord(recordService.getRecordById(rec.id));
      }
    });
  };

  const handleDeletePrompt = (id) => {
    const rec = recordService.getRecordById(id);
    requestPinAuth(t("authDeleteFir", `Authorization Required: Delete FIR #${rec?.crimeNo || ''}`), () => {
      setDeleteConfirmId(id);
    });
  };

  const handleDeleteRecord = (id) => {
    recordService.deleteRecord(id);
    setDeleteConfirmId(null);
    reloadRecords();
  };

  return (
    <div className="flex flex-col font-inter">
      {/* Title Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800/80 pb-6 mb-6 px-6">
        <PageHeader
          title={t("recordsTitle", "CCTNS FIR Records Directory")}
          subtitle={t("recordsSubtitle", "Full Cloud Persistence & Relational Datastore Management")}
        />

        <button
          onClick={handleOpenCreateModal}
          className="h-11 rounded-[4px] bg-[#2563eb] hover:bg-blue-600 px-6 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm border-none outline-none font-space self-start md:self-auto active:scale-95"
        >
          <FaFolderPlus className="text-sm" />
          <span>{t("btnRegisterFir", "+ Register New FIR")}</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="h-[96px] rounded-[4px] border-t-2 border-t-[#2563eb] border-r border-b border-l border-slate-800 bg-[#081220] pt-[18px] pb-[18px] px-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-widest text-slate-400">{t("kpiTotalFirs", "TOTAL REGISTERED FIRS")}</span>
            <h3 className="font-mono text-3xl sm:text-[34px] font-bold text-white mt-1 leading-none">{stats.total}</h3>
          </div>
          <div className="h-8 w-8 rounded-[2px] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 self-center">
            <FaShieldAlt className="text-sm" />
          </div>
        </div>

        <div className="h-[96px] rounded-[4px] border-t-2 border-t-[#d97706] border-r border-b border-l border-slate-800 bg-[#081220] pt-[18px] pb-[18px] px-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-widest text-amber-400">{t("kpiActiveInvestigations", "ACTIVE INVESTIGATIONS")}</span>
            <h3 className="font-mono text-3xl sm:text-[34px] font-bold text-white mt-1 leading-none">{stats.active}</h3>
          </div>
          <div className="h-8 w-8 rounded-[2px] bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 self-center">
            <FaUserCheck className="text-sm" />
          </div>
        </div>

        <div className="h-[96px] rounded-[4px] border-t-2 border-t-[#059669] border-r border-b border-l border-slate-800 bg-[#081220] pt-[18px] pb-[18px] px-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-widest text-emerald-400">{t("statusClosed", "Case Closed / Completed")}</span>
            <h3 className="font-mono text-3xl sm:text-[34px] font-bold text-white mt-1 leading-none">{stats.closed}</h3>
          </div>
          <div className="h-8 w-8 rounded-[2px] bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 self-center">
            <FaCheckCircle className="text-sm" />
          </div>
        </div>

        <div className="h-[96px] rounded-[4px] border-t-2 border-t-[#e11d48] border-r border-b border-l border-slate-800 bg-[#081220] pt-[18px] pb-[18px] px-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-widest text-rose-400">{t("severityCritical", "CRITICAL")}</span>
            <h3 className="font-mono text-3xl sm:text-[34px] font-bold text-white mt-1 leading-none">{stats.critical}</h3>
          </div>
          <div className="h-8 w-8 rounded-[2px] bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0 self-center">
            <FaExclamationTriangle className="text-sm" />
          </div>
        </div>
      </div>

      {/* Query Filters & Search Toolbar */}
      <div className="bg-[#081220] rounded-[4px] border border-[rgba(255,255,255,0.05)] pt-[18px] pb-[18px] px-6 space-y-6 shadow-sm mb-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-widest font-space">
            <FaFilter className="text-[#2563eb] text-sm" />
            <span>{t("searchPlaceholder", "Search FIR Records")}</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-[11px] font-semibold text-[#2563eb] hover:text-blue-400 transition-colors uppercase tracking-wider font-space cursor-pointer"
          >
            {t("btnReset", "Reset Filters")}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 text-xs font-mono">
          <div className="relative sm:col-span-2 lg:col-span-2">
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder={t("searchPlaceholder", "Search by FIR No, Officer, Complainant...")}
              className="w-full h-11 rounded-[4px] bg-[#0c182a] border border-slate-800 pl-10 pr-4 text-xs text-white outline-none focus:border-[#2563eb] placeholder-slate-500 transition-all font-inter"
            />
          </div>

          <div>
            <select
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              className="w-full h-11 rounded-[4px] bg-[#0c182a] border border-slate-800 px-4 text-xs text-slate-300 outline-none focus:border-[#2563eb] transition-all font-mono"
            >
              <option value="">{t("mapAllDistricts", "All Districts")}</option>
              <option value="Bengaluru City">Bengaluru City</option>
              <option value="Mysuru District">Mysuru District</option>
              <option value="Mangaluru City">Mangaluru City</option>
              <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
              <option value="Belagavi District">Belagavi District</option>
              <option value="Shivamogga">Shivamogga</option>
            </select>
          </div>

          <div>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full h-11 rounded-[4px] bg-[#0c182a] border border-slate-800 px-4 text-xs text-slate-300 outline-none focus:border-[#2563eb] transition-all font-mono"
            >
              <option value="">{t("mapAllCategories", "All Categories")}</option>
              <option value="Property Offences">{t("catProperty", "Property Offences")}</option>
              <option value="Body Offences">{t("catBody", "Body Offences")}</option>
              <option value="Cyber Crimes">{t("catCyber", "Cyber Crimes")}</option>
              <option value="Financial Fraud">{t("catFinancial", "Financial Fraud")}</option>
              <option value="Special & Local Laws (SLL)">{t("catSLL", "Special & Local Laws (SLL)")}</option>
            </select>
          </div>

          <div>
            <select
              name="severity"
              value={filters.severity}
              onChange={handleFilterChange}
              className="w-full h-11 rounded-[4px] bg-[#0c182a] border border-slate-800 px-4 text-xs text-slate-300 outline-none focus:border-[#2563eb] transition-all font-mono"
            >
              <option value="">{t("mapAllSeverities", "All Severities")}</option>
              <option value="CRITICAL">{t("severityCritical", "CRITICAL")}</option>
              <option value="HIGH">{t("severityHigh", "HIGH")}</option>
              <option value="MEDIUM">{t("severityMedium", "MEDIUM")}</option>
              <option value="LOW">{t("severityLow", "LOW")}</option>
            </select>
          </div>

          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full h-11 rounded-[4px] bg-[#0c182a] border border-slate-800 px-4 text-xs text-slate-300 outline-none focus:border-[#2563eb] transition-all font-mono"
            >
              <option value="">All Case Statuses</option>
              <option value="ACTIVE">{t("statusActive", "Under Investigation")}</option>
              <option value="CLOSED">{t("statusClosed", "Case Closed / Completed")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main FIR Data Table */}
      <div className="rounded-[4px] border border-slate-800 bg-[#081220] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-[#0c1626] font-space text-[10px] font-bold text-slate-300 uppercase tracking-wider border-b border-slate-700">
                <th className="py-3.5 pl-6 pr-4 border-b border-slate-700">{t("thCrimeNo", "FIR / Crime No")}</th>
                <th className="py-3.5 px-4 border-b border-slate-700">{t("thDistrictUnit", "District & Police Station")}</th>
                <th className="py-3.5 px-4 border-b border-slate-700">{t("thCategorySeverity", "Category & Severity")}</th>
                <th className="py-3.5 px-4 border-b border-slate-700">{t("thComplainant", "Complainant")}</th>
                <th className="py-3.5 px-4 border-b border-slate-700">{t("thOfficerName", "Officer Name")}</th>
                <th className="py-3.5 px-4 border-b border-slate-700">{t("thAccused", "Accused Suspect")}</th>
                <th className="py-3.5 px-4 border-b border-slate-700">{t("thStatus", "Case Status")}</th>
                <th className="py-3.5 pl-4 pr-6 border-b border-slate-700 text-right">{t("thActions", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500 font-mono">
                    No CCTNS FIR records match your filter criteria.
                  </td>
                </tr>
              ) : (
                records.map((r) => {
                  const isClosed = r.status === "Case Closed / Completed";

                  return (
                    <tr key={r.id} className="odd:bg-[#081220] even:bg-[#0b1424] hover:bg-[#2563eb]/5 transition-colors duration-150">
                      {/* Crime No & Date */}
                      <td className="py-3.5 pl-6 pr-4 font-mono border-b border-slate-800/40">
                        <div className="font-bold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors text-xs" onClick={() => handleOpenDetailModal(r)}>
                          {r.crimeNo}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">Reg: {r.regDate}</div>
                      </td>

                      {/* Jurisdiction */}
                      <td className="py-3.5 px-4 border-b border-slate-800/40">
                        <div className="font-bold text-slate-200 text-xs">{r.unit}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{r.district}</div>
                      </td>

                      {/* Category & Section */}
                      <td className="py-3.5 px-4 border-b border-slate-800/40">
                        <div className="font-bold text-slate-200 text-xs">{r.crimeHead}</div>
                        <div className="text-[10px] font-mono text-purple-400 mt-1">{r.actSections}</div>
                      </td>

                      {/* Complainant */}
                      <td className="py-3.5 px-4 border-b border-slate-800/40">
                        <div className="font-bold text-slate-200 text-xs">{r.complainantName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{r.complainantPhone || "N/A"}</div>
                      </td>

                      {/* Allotted Officer */}
                      <td className="py-3.5 px-4 border-b border-slate-800/40 font-mono">
                        <div className="font-bold text-slate-200 text-xs">{r.allottedOfficerName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{r.allottedOfficerRank} • {r.allottedOfficerKgid}</div>
                      </td>

                      {/* Suspect */}
                      <td className="py-3.5 px-4 border-b border-slate-800/40">
                        <div className="font-bold text-slate-200 text-xs">{r.accusedName}</div>
                        <div className="text-[10px] font-mono text-amber-500 mt-0.5">{r.accusedStatus}</div>
                      </td>

                      {/* Status & Severity */}
                      <td className="py-3.5 px-4 border-b border-slate-800/40 font-mono">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-[4px] border uppercase tracking-wider font-mono ${isClosed
                              ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/5 text-amber-400 border-amber-500/20"
                            }`}>
                            {isClosed ? "CLOSED / COMPLETED" : r.status}
                          </span>

                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wider font-mono border ${r.severity === "CRITICAL" ? "bg-rose-500/5 text-rose-400 border-rose-500/20" :
                              r.severity === "HIGH" ? "bg-amber-500/5 text-amber-400 border-amber-500/20" :
                                "bg-blue-500/5 text-blue-400 border-blue-500/20"
                            }`}>
                            {r.severity}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-4 pr-6 text-right font-mono border-b border-slate-800/40">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* View Detail */}
                          <button
                            onClick={() => handleOpenDetailModal(r)}
                            className="p-2 rounded-[4px] border border-slate-800 bg-[#0c182a] text-slate-400 hover:text-blue-400 hover:bg-[#11223c] hover:border-slate-700 transition-colors"
                            title="Inspect Full FIR Dossier"
                          >
                            <FaEye />
                          </button>

                          {/* Edit Record */}
                          <button
                            onClick={() => handleOpenEditModal(r)}
                            className="p-2 rounded-[4px] border border-slate-800 bg-[#0c182a] text-slate-400 hover:text-purple-400 hover:bg-[#1b1932] hover:border-slate-700 transition-colors"
                            title="Edit Record Fields"
                          >
                            <FaEdit />
                          </button>

                          {/* Toggle Closed Status */}
                          <button
                            onClick={() => handleToggleCaseClosed(r.id)}
                            className={`p-2 rounded-[4px] border transition-colors ${isClosed
                                ? "border-slate-800 bg-[#0c182a] text-amber-400 hover:bg-[#201d24] hover:border-slate-700"
                                : "border-slate-800 bg-[#0c182a] text-emerald-400 hover:bg-[#0f2122] hover:border-slate-700"
                              }`}
                            title={isClosed ? "Re-open Case Investigation" : "Mark Case Closed / Completed"}
                          >
                            {isClosed ? <FaUndo /> : <FaCheckCircle />}
                          </button>

                          {/* Delete Record */}
                          <button
                            onClick={() => handleDeletePrompt(r.id)}
                            className="p-2 rounded-[4px] border border-slate-800 bg-[#0c182a] text-slate-400 hover:text-rose-400 hover:bg-[#24131d] hover:border-slate-700 transition-colors"
                            title="Delete FIR Record"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center gap-3 text-rose-500">
              <FaExclamationTriangle className="text-2xl" />
              <h3 className="text-base font-mono font-bold uppercase text-white">Delete FIR Record?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete FIR record <code className="text-rose-400 font-mono font-bold">{recordService.getRecordById(deleteConfirmId)?.crimeNo}</code>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRecord(deleteConfirmId)}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold uppercase"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Authorization Modal */}
      <PINVerificationModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={pinActionCallback}
        actionTitle={pinActionTitle}
      />

      {/* Form Modal (Create / Edit) */}
      <FIRFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveRecord}
        initialData={selectedRecord}
      />

      {/* Detail Dossier Inspection Modal */}
      <FIRDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
        onToggleStatus={handleToggleCaseClosed}
      />
    </div>
  );
};

export default ManageRecords;
