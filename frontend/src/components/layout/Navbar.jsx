import { HiBars3 } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 transition hover:bg-slate-800">
          <HiBars3 className="text-2xl text-white" />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-white">
            Karnataka State Police
          </h1>
          <p className="text-xs text-slate-400">
            AI Crime Intelligence Platform
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 transition hover:bg-slate-800">
          <IoNotificationsOutline className="text-xl text-slate-300" />
        </button>

        <button className="rounded-lg p-2 transition hover:bg-slate-800">
          <FiSettings className="text-xl text-slate-300" />
        </button>

        <FaUserCircle className="text-3xl text-slate-300" />
      </div>
    </header>
  );
}

export default Navbar;