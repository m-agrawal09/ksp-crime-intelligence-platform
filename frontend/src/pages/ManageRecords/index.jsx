import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import FIRFormModal from "../../components/records/FIRFormModal";
import FIRDetailModal from "../../components/records/FIRDetailModal";
import PINVerificationModal from "../../components/records/PINVerificationModal";
import { recordService } from "../../services/recordService";
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

  // Handlers for CRUD with PIN protection
  const handleOpenCreateModal = () => {
    requestPinAuth("Register New FIR Record", () => {
      setSelectedRecord(null);
      setIsFormOpen(true);
    });
  };

  const handleOpenEditModal = (record) => {
    requestPinAuth(`Edit FIR ${record.crimeNo}`, () => {
      setSelectedRecord(record);
      setIsFormOpen(true);
    });
  };

  const handleOpenDetailModal = (record) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleSaveRecord = (formData) => {
    if (selectedRecord && selectedRecord.id) {
      recordService.updateRecord(selectedRecord.id, formData);
    } else {
      recordService.createRecord(formData);
    }
    setIsFormOpen(false);
    setSelectedRecord(null);
    reloadRecords();
  };

  const handleToggleCaseClosed = (id) => {
    const rec = recordService.getRecordById(id);
    const actionText = rec?.status === "Case Closed / Completed" ? "Re-open Case Investigation" : "Mark Case Closed / Completed";
    
    requestPinAuth(`${actionText} for ${rec?.crimeNo || 'FIR'}`, () => {
      recordService.toggleCaseClosed(id);
      reloadRecords();
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord(recordService.getRecordById(id));
      }
    });
  };

  const handleDeletePrompt = (id) => {
    const rec = recordService.getRecordById(id);
    requestPinAuth(`Delete FIR ${rec?.crimeNo || ''}`, () => {
      setDeleteConfirmId(id);
    });
  };

  const handleDeleteRecord = (id) => {
    recordService.deleteRecord(id);
    setDeleteConfirmId(null);
    reloadRecords();
  };

  // Statistics Summary
  const stats = useMemo(() => {
    const all = recordService.getRecords();
    const active = all.filter((r) => r.status !== "Case Closed / Completed").length;
    const closed = all.filter((r) => r.status === "Case Closed / Completed").length;
    const critical = all.filter((r) => r.severity === "CRITICAL").length;
    return { total: all.length, active, closed, critical };
  }, [records]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Title Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="CCTNS Manage Records & FIR Console"
          subtitle="Register new First Information Reports, update case timelines, allocate investigating officers, and mark completed case closures"
        />

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all self-start md:self-auto active:scale-95"
        >
          <FaFolderPlus className="text-base" />
          <span>Register New FIR</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Total Registered FIRs</span>
            <h3 className="font-mono text-2xl font-bold text-white mt-1">{stats.total}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FaShieldAlt className="text-lg" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">Active Investigations</span>
            <h3 className="font-mono text-2xl font-bold text-white mt-1">{stats.active}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FaUserCheck className="text-lg" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Closed / Completed Cases</span>
            <h3 className="font-mono text-2xl font-bold text-white mt-1">{stats.closed}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FaCheckCircle className="text-lg" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">Critical Severity Incidents</span>
            <h3 className="font-mono text-2xl font-bold text-white mt-1">{stats.critical}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-600/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <FaExclamationTriangle className="text-lg" />
          </div>
        </div>
      </div>

      {/* Query Filters & Search Toolbar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
            <FaFilter className="text-blue-500" />
            <span>Search & Filter FIR Records</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <FaSearch className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search Crime No, Name, Officer..."
              className="w-full rounded-lg bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-slate-200 outline-none focus:border-blue-500 placeholder-slate-600"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="">All District Ranges</option>
              <option value="Bengaluru City">Bengaluru City</option>
              <option value="Mangaluru City">Mangaluru City</option>
              <option value="Mysuru City">Mysuru City</option>
              <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
              <option value="Belagavi District">Belagavi District</option>
            </select>
          </div>

          {/* Crime Category Filter */}
          <div>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="">All Crime Categories</option>
              <option value="Property Offences">Property Offences</option>
              <option value="Offences Against Body">Offences Against Body</option>
              <option value="Cyber Crimes">Cyber Crimes</option>
              <option value="Financial Fraud">Financial Fraud</option>
              <option value="Special & Local Laws (SLL)">Special & Local Laws (SLL)</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              name="severity"
              value={filters.severity}
              onChange={handleFilterChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="">All Severity Levels</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="">All Case Statuses</option>
              <option value="ACTIVE">Active Cases</option>
              <option value="CLOSED">Case Closed / Completed</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Suspect Apprehended">Suspect Apprehended</option>
              <option value="Charge-sheet Submitted">Charge-sheet Submitted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main FIR Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Crime No & Date</th>
                <th className="py-3.5 px-4">Jurisdiction</th>
                <th className="py-3.5 px-4">Crime Category & Section</th>
                <th className="py-3.5 px-4">Complainant</th>
                <th className="py-3.5 px-4">Allotted Officer</th>
                <th className="py-3.5 px-4">Accused / Suspect</th>
                <th className="py-3.5 px-4">Status & Severity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                    No CCTNS FIR records match your filter criteria.
                  </td>
                </tr>
              ) : (
                records.map((r) => {
                  const isClosed = r.status === "Case Closed / Completed";

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Crime No & Date */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-blue-400 hover:underline cursor-pointer" onClick={() => handleOpenDetailModal(r)}>
                          {r.crimeNo}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Reg: {r.regDate}</div>
                      </td>

                      {/* Jurisdiction */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{r.unit}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{r.district}</div>
                      </td>

                      {/* Category & Section */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{r.crimeHead}</div>
                        <div className="text-[10px] font-mono text-purple-300 mt-0.5">{r.actSections}</div>
                      </td>

                      {/* Complainant */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{r.complainantName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{r.complainantPhone || "N/A"}</div>
                      </td>

                      {/* Allotted Officer */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-200">{r.allottedOfficerName}</div>
                        <div className="text-[10px] text-slate-500">{r.allottedOfficerRank} • {r.allottedOfficerKgid}</div>
                      </td>

                      {/* Suspect */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{r.accusedName}</div>
                        <div className="text-[10px] font-mono text-amber-400">{r.accusedStatus}</div>
                      </td>

                      {/* Status & Severity */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                            isClosed
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                          }`}>
                            {isClosed ? "CLOSED / COMPLETED" : r.status}
                          </span>

                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            r.severity === "CRITICAL" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                            r.severity === "HIGH" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>
                            {r.severity}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail */}
                          <button
                            onClick={() => handleOpenDetailModal(r)}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
                            title="Inspect Full FIR Dossier"
                          >
                            <FaEye />
                          </button>

                          {/* Edit Record */}
                          <button
                            onClick={() => handleOpenEditModal(r)}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-purple-400 hover:border-purple-500/40 transition-colors"
                            title="Edit Record Fields"
                          >
                            <FaEdit />
                          </button>

                          {/* Toggle Closed Status */}
                          <button
                            onClick={() => handleToggleCaseClosed(r.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isClosed
                                ? "border-amber-900/40 bg-amber-950/20 text-amber-400 hover:bg-amber-900/40"
                                : "border-emerald-900/40 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/40"
                            }`}
                            title={isClosed ? "Re-open Case Investigation" : "Mark Case Closed / Completed"}
                          >
                            {isClosed ? <FaUndo /> : <FaCheckCircle />}
                          </button>

                          {/* Delete Record */}
                          <button
                            onClick={() => handleDeletePrompt(r.id)}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
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
