import { useState, useEffect } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FloatingChatWidget from "../assistant/FloatingChatWidget";
import ShapeGrid from "../backgrounds/ShapeGrid";
import { recordService } from "../../services/recordService";
import { useAuth } from "../../context/AuthContext";

import {
  RiDashboardLine,
  RiBrainLine,
  RiSettings4Line,
  RiCloseLine,
  RiNodeTree,
  RiTimeLine
} from "react-icons/ri";
import { TbMapSearch } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineDocumentChartBar, HiOutlineDocumentText } from "react-icons/hi2";
import kspLogo from "../../assets/images/ksp-emblem.png";

const menuItems = [
  { name: "Dashboard", path: "/", icon: RiDashboardLine },
  { name: "Crime Map", path: "/map", icon: TbMapSearch },
  { name: "Link & Network Analysis", path: "/network-analysis", icon: RiNodeTree },
  { name: "Diurnal Heat & Red-Zones", path: "/spatiotemporal", icon: RiTimeLine },
  { name: "AI Insights & Forecast", path: "/insights-forecast", icon: RiBrainLine },
  { name: "Officer Performance", path: "/officers", icon: MdOutlineAdminPanelSettings },
  { name: "Manage Records", path: "/records", icon: HiOutlineDocumentText },
  { name: "Reports", path: "/reports", icon: HiOutlineDocumentChartBar },
  { name: "Settings", path: "/settings", icon: RiSettings4Line },
];

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, isAdmin } = useAuth();

  // Close mobile drawer automatically when navigating to any page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch remote records from backend on app startup so all pages have data
  useEffect(() => {
    recordService.fetchRemoteRecords().then((records) => {
      console.log(`[Layout] Fetched ${records?.length || 0} records from backend into localStorage.`);
    }).catch((err) => {
      console.warn("[Layout] fetchRemoteRecords failed:", err);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] overflow-x-hidden relative">
      {/* Dynamic Animated ShapeGrid Background (React Bits) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-75">
        <ShapeGrid 
          speed={0.45}
          squareSize={36}
          size={36}
          direction="diagonal"
          borderColor="#2a0a62"
          hoverFillColor="#222"
          shape="square"
          hoverTrailAmount={5}
        />
      </div>

      <div className="relative z-10">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative flex-1 max-w-xs w-full bg-[#070d1a] border-r border-slate-800 flex flex-col z-10 font-inter shadow-2xl">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <img src={kspLogo} alt="KSP Emblem" className="w-8 h-8 object-contain" />
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider font-sans">Karnataka Police</h2>
                  <p className="text-[9px] font-mono text-blue-400">Mobile Navigation</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Menu"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            {/* Navigation items */}
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex h-[44px] items-center gap-3.5 rounded-sm px-3.5 text-sm font-medium transition-all group ${
                        isActive
                          ? "bg-blue-600/30 text-white font-semibold border-l-4 border-blue-500 shadow-sm shadow-blue-500/20"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`text-xl flex-shrink-0 transition-colors ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
              })}
            </nav>

            {/* Drawer Footer User Profile */}
            <div className="border-t border-slate-800 p-4 bg-slate-950/60 space-y-3">
              {currentUser && (
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center font-bold bg-blue-600 text-white flex-shrink-0">
                    {isAdmin ? "A" : "O"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      {currentUser.rank} • <span className="text-blue-400 font-bold">{currentUser.role}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Main App Body */}
      <div className="flex">
        {/* Desktop Sidebar (hidden on mobile, fixed at 280px on desktop) */}
        <Sidebar />

        {/* Dynamic Main Workspace Container */}
        <main className="main-workspace-layout bg-blueprint">
          <div className="main-content-boundary">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Copilot Widget */}
      <FloatingChatWidget />
      </div>
    </div>
  );
}

export default Layout;