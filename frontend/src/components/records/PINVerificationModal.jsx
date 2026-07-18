import React, { useState, useEffect } from "react";
import { FaTimes, FaLock, FaKey, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const PINVerificationModal = ({ isOpen, onClose, onSuccess, actionTitle = "Manage Record Action" }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { verifyPin } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!pin.trim()) {
      setError("Please enter the 4-digit security PIN.");
      return;
    }

    const isValid = verifyPin(pin);

    if (isValid) {
      onSuccess();
      onClose();
    } else {
      setError("Incorrect Security PIN. Authorized officers only.");
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-5 shadow-2xl font-sans relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
            <FaLock />
            <span>Security PIN Authorization</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Prompt */}
        <div className="text-center space-y-1">
          <div className="h-12 w-12 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
            <FaKey className="text-lg animate-pulse" />
          </div>
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mt-2">
            Authorization Required
          </h3>
          <p className="text-xs text-slate-400">
            Enter the 4-digit Security PIN to proceed with <strong className="text-slate-200">{actionTitle}</strong>.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
            <FaExclamationCircle className="text-sm flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (Default: 1122)"
              autoFocus
              className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              <FaCheckCircle /> Authorize
            </button>
          </div>
        </form>

        <div className="text-[10px] text-center font-mono text-slate-500 border-t border-slate-900 pt-2">
          Only Admin can configure PIN in Settings • Default PIN is <code className="text-blue-400 font-bold">1122</code>
        </div>

      </div>
    </div>
  );
};

export default PINVerificationModal;
