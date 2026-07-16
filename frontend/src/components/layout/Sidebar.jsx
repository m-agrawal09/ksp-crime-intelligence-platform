import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineDocumentReport,
} from "react-icons/hi";
import { MdOutlineInsights } from "react-icons/md";
import { FiMap, FiSettings } from "react-icons/fi";
import { LuChartSpline } from "react-icons/lu";
import { PiRobotBold } from "react-icons/pi";
import { FaUserShield } from "react-icons/fa6";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: HiOutlineHome,
  },
  {
    name: "AI Insights",
    path: "/insights",
    icon: MdOutlineInsights,
  },
  {
    name: "Crime Map",
    path: "/map",
    icon: FiMap,
  },
  {
    name: "Trend Forecast",
    path: "/forecast",
    icon: LuChartSpline,
  },
  {
    name: "Officer Performance",
    path: "/officers",
    icon: FaUserShield,
  },
  {
    name: "AI Assistant",
    path: "/assistant",
    icon: PiRobotBold,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: HiOutlineDocumentReport,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: FiSettings,
  },
];

function Sidebar() {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-900">
      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="text-xl" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;