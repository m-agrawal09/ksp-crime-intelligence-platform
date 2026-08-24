import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  RiDashboardLine,
  RiBrainLine,
  RiSettings4Line,
  RiNodeTree,
  RiTimeLine,
} from "react-icons/ri";
import { TbMapSearch } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineDocumentChartBar, HiOutlineDocumentText } from "react-icons/hi2";

const menuCategories = [
  {
    category: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: RiDashboardLine,
      },
    ],
  },
  {
    category: "ANALYSIS",
    items: [
      {
        name: "Crime Map",
        path: "/map",
        icon: TbMapSearch,
      },
      {
        name: "Link & Network Analysis",
        path: "/network-analysis",
        icon: RiNodeTree,
      },
      {
        name: "Diurnal Heat & Red-Zones",
        path: "/spatiotemporal",
        icon: RiTimeLine,
      },
    ],
  },
  {
    category: "INTELLIGENCE & OPERATIONS",
    items: [
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
    ],
  },
  {
    category: "SYSTEM",
    items: [
      {
        name: "Settings",
        path: "/settings",
        icon: RiSettings4Line,
      },
    ],
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

  // Format full current date
  const dateFormatted = time.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <aside className="hidden lg:flex h-[calc(100vh-80px)] w-[285px] flex-col border-r border-slate-800/90 bg-[#060b18] font-inter flex-shrink-0 select-none">

      {/* Navigation - Categorized & Nested Subcategories */}
      <nav className="flex-grow px-3.5 py-5 space-y-5 overflow-y-auto custom-scrollbar">
        {menuCategories.map((group) => (
          <div key={group.category} className="space-y-1.5">
            {/* Category Header */}
            <div className="flex items-center gap-2 px-2.5 pt-1 pb-1 text-[11px] font-bold tracking-wider text-cyan-500/90 uppercase font-mono border-b border-slate-800/60">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
              <span>{group.category}</span>
            </div>

            {/* Subcategory Items */}
            <div className="pl-1.5 space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex h-[44px] items-center gap-3.5 rounded-lg px-3 text-[14px] font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600/25 text-white font-semibold border-l-4 border-blue-500 shadow-sm shadow-blue-500/10"
                          : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="text-[20px] flex-shrink-0 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    <span className="truncate tracking-wide">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Operational Clock Footer */}
      <div className="border-t border-slate-800/80 px-4 py-3.5 font-mono text-[11px] space-y-2 bg-[#040711]">
        <div className="flex items-center justify-between font-semibold tracking-wider">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-200 tabular-nums font-bold">{hours}:{minutes}:{seconds}</span>
          </div>
          <span className="text-slate-400 text-[10px]">{dateFormatted}</span>
        </div>
        <div className="flex items-center justify-between text-[9.5px] text-slate-500 tracking-wider uppercase border-t border-slate-800/40 pt-2 font-bold">
          <span>CCTNS SDK ONLINE</span>
          <span className="text-cyan-400">ZOHO CATALYST</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;