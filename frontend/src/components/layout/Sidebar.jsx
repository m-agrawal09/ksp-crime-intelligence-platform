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

      {/* Compact Secondary Operational Clock Footer */}
      <div className="border-t border-slate-800/80 px-3.5 py-3 font-mono text-[10px] space-y-1.5 bg-[#050914]">
        <div className="flex items-center justify-between font-semibold tracking-wider">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-200 tabular-nums">{hours}:{minutes} IST</span>
          </div>
          <span className="text-slate-400 text-[9px]">{dateFormatted}</span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-slate-500 tracking-wider uppercase border-t border-slate-800/40 pt-1.5 font-bold">
          <span>CCTNS SDK ONLINE</span>
          <span className="text-blue-400">ZOHO CATALYST</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;