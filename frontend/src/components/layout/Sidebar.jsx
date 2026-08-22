import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  RiDashboardLine,
  RiBrainLine,
  RiRobot2Line,
  RiSettings4Line,
} from "react-icons/ri";
import { TbMapSearch, TbChartLine } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineDocumentChartBar, HiOutlineDocumentText, HiOutlineClock } from "react-icons/hi2";
import { PiShieldStarFill } from "react-icons/pi";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: RiDashboardLine,
  },
  {
    name: "Crime Map",
    path: "/map",
    icon: TbMapSearch,
  },
  {
    name: "AI Insights & Forecast",
    path: "/insights-forecast",
    icon: RiBrainLine,
  },
  {
    name: "Officer Performance",
    path: "/officers",
    icon: MdOutlineAdminPanelSettings,
  },
  {
    name: "Manage Records",
    path: "/records",
    icon: HiOutlineDocumentText,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: HiOutlineDocumentChartBar,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: RiSettings4Line,
  },
];

function Sidebar() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format 24-hour time string HH:mm:ss
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");
  const time24 = `${hours}:${minutes}:${seconds}`;

  // Format full current date
  const dateFormatted = time.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <aside className="hidden lg:flex h-[calc(100vh-80px)] w-[280px] flex-col border-r border-slate-800 bg-[#070d1a] font-inter flex-shrink-0">

      {/* Navigation - group elements with tighter vertical spacing */}
      <nav className="flex-grow px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex h-[50px] items-center gap-3.5 rounded-md px-4 text-[14px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/90 text-white font-semibold"
                    : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-200"
                }`
              }
            >
              <Icon className="text-[23px] flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer & Live 24-Hour Clock */}
      <div className="border-t border-slate-800 p-4 space-y-2.5">
        {/* Real-time 24-hour clock card */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-700/50 px-4 py-3 flex items-center justify-between font-mono shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[21px] font-bold text-slate-200 tracking-widest tabular-nums leading-none">
              {time24}
            </span>
            <span className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">
              {dateFormatted}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/40 px-2 py-1 rounded-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-[9px] font-bold text-slate-300 tracking-wider">LIVE</span>
          </div>
        </div>

        {/* Catalyst Status Badge */}
        <div className="rounded-md bg-slate-900/40 px-3.5 py-2.5 border border-slate-800/30 flex items-center justify-between">
          <p className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
            Catalyst SDK
          </p>
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;