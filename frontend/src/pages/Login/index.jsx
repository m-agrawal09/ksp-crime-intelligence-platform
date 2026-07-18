import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PiShieldStarFill } from "react-icons/pi";
import { FaUserShield, FaUserCheck, FaLock, FaKey, FaExclamationCircle } from "react-icons/fa";

const Login = () => {
  const [activeTab, setActiveTab] = useState("admin"); // "admin" | "officer"
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginAdmin, loginOfficer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError("");
    if (tab === "admin") {
      setUsername("admin");
      setPassword("admin");
    } else {
      setUsername("ksp.ramesh");
      setPassword("Officer@123");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (activeTab === "admin") {
        await loginAdmin(username, password);
      } else {
        await loginOfficer(username, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Brand & Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-1">
            <PiShieldStarFill className="text-3xl" />
          </div>
          <h1 className="text-xl font-bold font-mono tracking-wider text-white">
            KSP CRIME INTELLIGENCE
          </h1>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">
            Command & Control Portal Access
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleTabSwitch("admin")}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold uppercase transition-all ${
              activeTab === "admin"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FaUserShield className="text-sm" />
            <span>Admin Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("officer")}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold uppercase transition-all ${
              activeTab === "officer"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FaUserCheck className="text-sm" />
            <span>Officer Login</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <FaExclamationCircle className="text-base flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              {activeTab === "admin" ? "Admin ID / Username" : "Officer Username"}
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activeTab === "admin" ? "admin" : "e.g. ksp.ramesh"}
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs font-mono text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <FaKey className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs font-mono text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all active:scale-[0.98] ${
              activeTab === "admin"
                ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/25"
                : "bg-purple-600 hover:bg-purple-500 shadow-purple-500/25"
            } disabled:opacity-50`}
          >
            {isSubmitting ? "Authenticating..." : `Sign In as ${activeTab === "admin" ? "Administrator" : "Police Officer"}`}
          </button>
        </form>

        {/* Demo Helper Box */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-bold border-b border-slate-800 pb-1 text-[10px]">
            <span>DEMO TEST CREDENTIALS</span>
            <span className="text-blue-400">PIN: 1122</span>
          </div>

          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-blue-400 font-bold">🛡️ Admin Portal:</span>
              <span><code className="text-slate-200">admin</code> / <code className="text-slate-200">admin</code></span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-purple-400 font-bold">👮 Officer Portal:</span>
              <span><code className="text-slate-200">ksp.ramesh</code> / <code className="text-slate-200">Officer@123</code></span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center font-mono text-[10px] text-slate-600">
          Karnataka State Police CCTNS Portal • Encrypted Gateway v4.2
        </div>

      </div>
    </div>
  );
};

export default Login;
