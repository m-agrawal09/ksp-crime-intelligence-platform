import React, { useState } from "react";
import { FaTimes, FaUserPlus, FaKey, FaShieldAlt, FaSave } from "react-icons/fa";

const AddOfficerModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    rank: "PSI",
    badgeNumber: "",
    unit: "Koramangala Police Station",
    station: "Bengaluru City Range",
    yearsOfService: "5",
    specialArea: "Cyber Crime & Digital Forensics",
    username: "",
    password: "Officer@123"
  });

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate suggested username if name changes and username not manually touched
      if (name === "name" && value.trim()) {
        const cleanName = value.trim().toLowerCase().replace(/\s+/g, "");
        updated.username = `ksp.${cleanName}`;
      }
      
      // Auto-generate suggested badge if name changes
      if (name === "name" && value.trim()) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        updated.badgeNumber = `KSP-2026-IN${rand}`;
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter the officer's full name.");
      return;
    }

    if (!formData.username.trim()) {
      setError("Please specify a login username for the officer.");
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    try {
      onAdd(formData);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to register officer.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden my-8 font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FaUserPlus className="text-base" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold text-white tracking-wider uppercase">
                Register New Police Officer
              </h2>
              <p className="text-xs text-slate-400">
                Admin Console • Add Officer Dossier & Generate Login Credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 transition-colors rounded-lg hover:bg-slate-800"
          >
            <FaTimes className="text-base" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Section 1: Officer Profile Details */}
          <div className="space-y-4">
            <h3 className="font-mono font-bold text-blue-400 uppercase text-xs border-b border-slate-800 pb-1 flex items-center gap-2">
              <FaShieldAlt /> 1. Officer Dossier Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Full Name & Title *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Vikram Seth"
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Officer Rank *</label>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                >
                  <option value="PSI">PSI (Police Sub-Inspector)</option>
                  <option value="CPI">CPI (Circle Police Inspector)</option>
                  <option value="ASI">ASI (Assistant Sub-Inspector)</option>
                  <option value="Police Inspector">Police Inspector</option>
                  <option value="Assistant Commissioner">Assistant Commissioner (ACP)</option>
                  <option value="Deputy Superintendent">Deputy Superintendent (DySP)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">KGID Badge Number</label>
                <input
                  type="text"
                  name="badgeNumber"
                  value={formData.badgeNumber}
                  onChange={handleChange}
                  placeholder="e.g. KSP-2026-IN9940"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Years of Service</label>
                <input
                  type="number"
                  name="yearsOfService"
                  value={formData.yearsOfService}
                  onChange={handleChange}
                  placeholder="5"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Assigned Division / Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g. Cyber Crime Division"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Specialization Area</label>
                <input
                  type="text"
                  name="specialArea"
                  value={formData.specialArea}
                  onChange={handleChange}
                  placeholder="e.g. Digital Forensics"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Account Credentials Generation */}
          <div className="space-y-4 pt-2">
            <h3 className="font-mono font-bold text-purple-400 uppercase text-xs border-b border-slate-800 pb-1 flex items-center gap-2">
              <FaKey /> 2. Login Credentials & Access Account
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-purple-950/20 p-4 rounded-xl border border-purple-900/40">
              <div>
                <label className="block text-purple-300 font-mono mb-1 font-bold">Officer Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. ksp.vikram"
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-purple-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">Officer will use this username to log into the system.</span>
              </div>

              <div>
                <label className="block text-purple-300 font-mono mb-1 font-bold">Initial Password *</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Officer@123"
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-white outline-none focus:border-purple-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">Officer can change password later in Settings.</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs font-mono"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
            >
              <FaSave /> Register Officer & Generate Access
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AddOfficerModal;
