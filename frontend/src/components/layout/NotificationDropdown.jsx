import React, { useState, useEffect, useRef } from "react";
import { IoNotificationsOutline, IoCheckmarkDoneOutline } from "react-icons/io5";
import { FaExclamationTriangle, FaShieldAlt, FaEye, FaTimes } from "react-icons/fa";
import { recordService } from "../../services/recordService";
import FIRDetailModal from "../records/FIRDetailModal";

const READ_KEYS_STORAGE = "ksp_read_notification_ids_v1";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(READ_KEYS_STORAGE)) || [];
    } catch (err) {
      return [];
    }
  });

  const [selectedFirModal, setSelectedFirModal] = useState(null);
  const dropdownRef = useRef(null);

  // Load records and build notification items
  const loadNotifications = () => {
    const records = recordService.getRecords();
    
    // Sort records by registration date (newest first)
    const sorted = [...records].sort((a, b) => new Date(b.regDate) - new Date(a.regDate));

    // Filter important / critical / recent FIRs
    const items = sorted.slice(0, 15).map((r) => ({
      id: r.id || r.crimeNo,
      crimeNo: r.crimeNo,
      title: `${r.crimeHead || "Cognizable Offence"} at ${r.unit || r.district}`,
      unit: r.unit || r.district,
      district: r.district,
      severity: r.severity || "MEDIUM",
      status: r.status || "Under Investigation",
      date: r.regDate || "Recent",
      description: r.briefFacts || "FIR logged into CCTNS Master Repository.",
      officer: r.allottedOfficerName || "Investigating Officer",
      record: r
    }));

    setNotifications(items);
  };

  useEffect(() => {
    loadNotifications();

    const unsubscribe = recordService.subscribe(() => {
      loadNotifications();
    });

    return () => unsubscribe();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Unread items count
  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;
  const hasUnread = unreadCount > 0;

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      const nextRead = [...readIds, id];
      setReadIds(nextRead);
      localStorage.setItem(READ_KEYS_STORAGE, JSON.stringify(nextRead));
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem(READ_KEYS_STORAGE, JSON.stringify(allIds));
  };

  const handleOpenNotice = (item) => {
    markAsRead(item.id);
    setSelectedFirModal(item.record);
    setIsOpen(false);
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      
      {/* Bell Icon Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl p-2.5 transition hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer active:scale-95"
        title="Critical Cases & New FIR Notifications"
      >
        <IoNotificationsOutline className="text-2xl" />

        {/* Pulsing Red Dot Indicator & Count Badge */}
        {hasUnread && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 text-white font-mono text-[9px] font-extrabold items-center justify-center border border-slate-950">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Floating Dropdown Modal Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl z-50 space-y-3 font-sans selection:bg-rose-500/20">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FaExclamationTriangle className="text-rose-400 text-xs" /> Critical & New FIR Alerts
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {hasUnread && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[10px] font-mono text-blue-400 hover:text-blue-300 hover:underline"
                >
                  <IoCheckmarkDoneOutline className="text-xs" /> Mark All Read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-850 text-xs"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                No active FIR alerts registered.
              </div>
            ) : (
              notifications.map((n) => {
                const isRead = readIds.includes(n.id);
                const isCritical = n.severity === "CRITICAL" || n.severity === "HIGH";

                return (
                  <div
                    key={n.id}
                    onClick={() => handleOpenNotice(n)}
                    className={`group p-3 rounded-xl border transition-all cursor-pointer relative ${
                      !isRead
                        ? "bg-slate-900/90 border-slate-750 hover:border-rose-500/50"
                        : "bg-slate-950/60 border-slate-850 opacity-70 hover:opacity-100 hover:border-slate-700"
                    }`}
                  >
                    {/* Unread Red Indicator Bar */}
                    {!isRead && (
                      <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500" />
                    )}

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          n.severity === "CRITICAL" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-extrabold" :
                          n.severity === "HIGH" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                          "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {n.severity}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {n.date}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {n.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 font-sans line-clamp-2 mt-1 leading-snug">
                      {n.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-900 font-mono text-[9px] text-slate-500">
                      <span>Crime No: <strong className="text-slate-300">{n.crimeNo}</strong></span>
                      <span className="flex items-center gap-1 text-blue-400 group-hover:underline">
                        <FaEye className="text-[9px]" /> View FIR Dossier
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="border-t border-slate-850 pt-2 flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>CCTNS Real-time Telemetry Grid</span>
            <span>{notifications.length} Total Alerts Logged</span>
          </div>

        </div>
      )}

      {/* FIR Detail Dossier Modal Inspector */}
      {selectedFirModal && (
        <FIRDetailModal
          isOpen={!!selectedFirModal}
          onClose={() => setSelectedFirModal(null)}
          record={selectedFirModal}
        />
      )}
    </div>
  );
};

export default NotificationDropdown;
