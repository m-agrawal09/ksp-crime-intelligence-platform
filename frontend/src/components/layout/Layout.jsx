import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FloatingChatWidget from "../assistant/FloatingChatWidget";

function Layout() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-grow h-[calc(100vh-80px)] overflow-y-auto py-10 px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 flex justify-center bg-blueprint relative">
          <div className="w-full max-w-4xl relative z-10">
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