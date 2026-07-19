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

import kspLogo from "../../assets/images/ksp-emblem.png";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: RiDashboardLine,
  },
  {
    name: "AI Insights & Forecast",
    path: "/insights-forecast",
    icon: RiBrainLine,
  },
  {
    name: "Manage Records",
    path: "/records",
    icon: HiOutlineDocumentText,
  },
  {
    name: "Crime Map",
    path: "/map",
    icon: TbMapSearch,
  },
  {
    name: "Officer Performance",
    path: "/officers",
    icon: MdOutlineAdminPanelSettings,
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
    <aside className="flex h-[calc(100vh-80px)] w-[295px] flex-col border-r border-[var(--color-border)] bg-[#0b1220] font-inter">

      {/* Sidebar Header Branding (20% larger emblem and clear titles) */}
      <div className="border-b border-[var(--color-border)] px-6 py-6 flex flex-col items-center text-center">
        <img 
          src={kspLogo} 
          alt="Karnataka State Police Emblem" 
          className="w-[78px] h-auto object-contain mb-3"
        />
        <h2 className="text-xs font-bold text-white uppercase tracking-wider leading-tight font-sans">
          KARNATAKA STATE POLICE
        </h2>
        <p className="text-[9px] uppercase tracking-wider text-blue-400 font-sans mt-1.5 leading-normal font-bold">
          AI CRIME INTELLIGENCE PLATFORM
        </p>
      </div>

      {/* Navigation - group elements with tighter vertical spacing */}
      <nav className="flex-grow px-3 py-5 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex h-[52px] items-center gap-3.5 rounded-lg px-4 text-[15px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-900/30 font-bold"
                    : "text-[var(--color-text-muted)] hover:bg-[#0f172a] hover:text-white"
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
      <div className="border-t border-[var(--color-border)] p-5">
        <div className="rounded-lg bg-[#0f172a] p-4 border border-white/[0.03]">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            Catalyst
          </p>

          <p className="mt-1 text-xs text-green-400 font-medium">
            ● Connected
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;