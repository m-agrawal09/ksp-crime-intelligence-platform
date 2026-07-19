import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FloatingChatWidget from "../assistant/FloatingChatWidget";

function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-grow h-[calc(100vh-80px)] overflow-y-auto pt-[28px] px-8 pb-8 flex justify-center bg-blueprint relative">
          <div className="w-full max-w-[1200px] relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Floating Tactical AI Copilot Widget */}
      <FloatingChatWidget />
    </div>
  );
}

export default Layout;