import { HiBars3 } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-8">

      {/* Left */}
      <div className="flex items-center gap-4">

        <button className="rounded-lg p-2 transition hover:bg-slate-800">
          <HiBars3 className="text-3xl text-white" />
        </button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Karnataka State Police
          </h1>

          <p className="text-sm uppercase tracking-[0.18em] text-blue-400">
            AI Crime Intelligence Platform
          </p>
        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        <button className="rounded-lg p-2 transition hover:bg-slate-800">
          <IoNotificationsOutline className="text-2xl text-slate-300" />
        </button>

        <button className="rounded-lg p-2 transition hover:bg-slate-800">
          <FiSettings className="text-2xl text-slate-300" />
        </button>

        <FaUserCircle className="text-4xl text-slate-300" />

      </div>

    </header>
  );
}

export default Navbar;