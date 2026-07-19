import { Link, useNavigate } from "react-router-dom";
import { HiBars3 } from "react-icons/hi2";
import { FiSettings } from "react-icons/fi";
import { FaUserShield, FaUserCheck, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import kspLogo from "../../assets/images/ksp-emblem.png";

function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-800/50 bg-slate-950/98 px-8 font-inter shadow-sm shadow-black/20">

      {/* Left */}
      <div className="flex items-center gap-4">

        <button className="rounded-lg p-2 transition hover:bg-slate-800">
          <HiBars3 className="text-3xl text-white" />
        </button>

        <div className="flex items-center gap-3">
          <img
            src={kspLogo}
            alt="Karnataka State Police Emblem"
            className="w-10 h-10 object-contain flex-shrink-0"
          />
          <div>
            <h1 className="text-base font-bold tracking-wider text-white uppercase leading-none mb-1 font-sans">
              Karnataka State Police
            </h1>
            <p className="text-[10px] uppercase tracking-[0.18em] text-blue-400 font-sans leading-none">
              AI Crime Intelligence Platform
            </p>
          </div>
        </div>

      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-4">

        {/* User Badge Info */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 font-mono text-xs">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center text-sm font-bold bg-blue-600 text-white">
              {isAdmin ? <FaUserShield /> : <FaUserCheck />}
            </div>
            <div className="text-left">
              <div className="font-bold text-white leading-none">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                {currentUser.rank} • <span className="text-blue-400 font-bold">{currentUser.role}</span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Notification Bell Dropdown */}
        <NotificationDropdown />

        <Link to="/settings" className="rounded-lg p-2 transition hover:bg-slate-800 text-slate-300 hover:text-white" title="Settings">
          <FiSettings className="text-xl" />
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-xl border border-rose-900/50 bg-rose-950/30 px-3 py-2 text-xs font-mono font-bold text-rose-300 hover:bg-rose-900/40 hover:text-white transition-all cursor-pointer"
          title="Sign Out"
        >
          <FaSignOutAlt className="text-xs" />
          <span>Logout</span>
        </button>

      </div>

    </header>
  );
}

export default Navbar;