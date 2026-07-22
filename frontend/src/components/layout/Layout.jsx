import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FloatingChatWidget from "../assistant/FloatingChatWidget";
import { recordService } from "../../services/recordService";

function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  // Fetch remote records from backend on app startup so all pages have data
  useEffect(() => {
    recordService.fetchRemoteRecords().then((records) => {
      console.log(`[Layout] Fetched ${records?.length || 0} records from backend into localStorage.`);
    }).catch((err) => {
      console.warn("[Layout] fetchRemoteRecords failed:", err);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-grow h-[calc(100vh-80px)] overflow-y-auto pt-10 px-10 pb-12 flex justify-center bg-blueprint relative">
          <div className="w-full max-w-[1320px] relative z-10">
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