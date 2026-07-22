import { NavLink } from "react-router-dom";
import {
  RiDashboardLine,
  RiBrainLine,
  RiRobot2Line,
  RiSettings4Line,
} from "react-icons/ri";
import { TbMapSearch, TbChartLine } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineDocumentChartBar, HiOutlineDocumentText } from "react-icons/hi2";
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
  return (
    <aside className="flex h-[calc(100vh-80px)] w-[280px] flex-col border-r border-slate-800 bg-[#070d1a] font-inter">

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

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-md bg-slate-900/40 px-4 py-3 border border-slate-800/20 flex items-center justify-between">
          <p className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider">
            Catalyst SDK
          </p>
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;