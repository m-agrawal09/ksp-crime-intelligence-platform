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
    <aside className="flex h-[calc(100vh-64px)] w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar)]">

      {/* Logo */}
      <div className="border-b border-[var(--color-border)] px-6 py-6">
        <div className="flex items-center gap-3">
          <PiShieldStarFill className="text-4xl text-[var(--color-primary)]" />

          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              KSP
            </h2>

            <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
              Crime Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-card)] hover:text-white"
                  }`
                }
              >
                <Icon className="text-2xl" />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--color-border)] p-5">
        <div className="rounded-xl bg-[var(--color-card)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            Catalyst
          </p>

          <p className="mt-1 text-xs text-green-400">
            ● Connected
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;