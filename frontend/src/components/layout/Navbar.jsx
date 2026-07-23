import { Link, useNavigate } from "react-router-dom";
import { HiBars3 } from "react-icons/hi2";
import { FiSettings, FiGlobe } from "react-icons/fi";
import { FaUserShield, FaUserCheck, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import NotificationDropdown from "./NotificationDropdown";
import kspLogo from "../../assets/images/ksp-emblem.png";

function Navbar({ onToggleMobileMenu }) {
  const { currentUser, isAdmin, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/98 px-4 sm:px-8 font-inter shadow-sm shadow-black/20">

      {/* Left Header Section */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Hamburger Menu Toggle for Mobile & Responsive */}
        <button
          onClick={onToggleMobileMenu}
          className="rounded-lg p-2 transition hover:bg-slate-800 cursor-pointer active:scale-95 text-white flex items-center justify-center"
          title="Toggle Navigation Menu"
        >
          <HiBars3 className="text-2xl sm:text-3xl text-white" />
        </button>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <img
            src={kspLogo}
            alt="Karnataka State Police Emblem"
            className="w-9 h-9 sm:w-12 sm:h-12 object-contain flex-shrink-0"
          />
          <div>
            <h1 className="text-xs sm:text-lg font-bold tracking-wider text-white uppercase leading-tight mb-0.5 sm:mb-1.5 font-sans">
              {t("brandTitle", "Karnataka State Police")}
            </h1>
            <p className="text-[8px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-blue-400 font-sans leading-normal">
              {t("brandSubtitle", "AI Crime Intelligence Platform")}
            </p>
          </div>
        </div>

      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* High-Tech Tactical Bilingual Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-950/40 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-mono font-bold text-blue-300 hover:bg-blue-900/50 hover:text-white transition-all cursor-pointer shadow-sm hover:border-blue-400 active:scale-95"
          title="Switch Language (English / ಕನ್ನಡ)"
        >
          <FiGlobe className="text-sm text-blue-400 animate-pulse" />
          <span className="font-bold tracking-wider">
            {lang === "EN" ? "EN | ಕನ್ನಡ" : "ಕನ್ನಡ | EN"}
          </span>
        </button>

        {/* User Badge Info (Desktop / Tablet) */}
        {currentUser && (
          <div className="hidden lg:flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 font-mono text-xs">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center text-sm font-bold bg-blue-600 text-white flex-shrink-0">
              {isAdmin ? <FaUserShield /> : <FaUserCheck />}
            </div>
            <div className="text-left">
              <div className="font-bold text-white leading-none">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                {currentUser.rank} • <span className="text-blue-400 font-bold">{isAdmin ? t("adminRole", "ADMIN") : t("officerRole", "OFFICER")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Notification Bell Dropdown */}
        <NotificationDropdown />

        <Link to="/settings" className="rounded-lg p-2 transition hover:bg-slate-800 text-slate-300 hover:text-white" title={t("settings", "Settings")}>
          <FiSettings className="text-lg sm:text-xl" />
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-xl border border-rose-900/50 bg-rose-950/30 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-mono font-bold text-rose-300 hover:bg-rose-900/40 hover:text-white transition-all cursor-pointer"
          title={t("logout", "Logout")}
        >
          <FaSignOutAlt className="text-xs" />
          <span className="hidden sm:inline">{t("logout", "Logout")}</span>
        </button>

      </div>

    </header>
  );
}

export default Navbar;