import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  FaSignOutAlt,
  FaUniversity,
  FaBars,
  FaBell,
  FaMoon,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  /* 🌙 DARK MODE (GLOBAL) */
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  /* Sync with <html> */
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* Dropdowns */
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "text-brand-700 dark:text-accent-400 font-semibold"
      : "text-brand-400 dark:text-brand-300 hover:text-brand-600";

  return (
    <header className="bg-white/90 dark:bg-brand-900/90 backdrop-blur-sm shadow-soft px-4 md:px-8 py-4 flex justify-between items-center text-brand-900 dark:text-brand-50 sticky top-0 z-10">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-2xl"
        >
          <FaBars />
        </button>

        {/* Logo */}
        <h1 className="flex items-center gap-2 text-xl font-bold text-brand-800 dark:text-white">
          <span className="p-1.5 rounded-lg bg-brand-700 text-white text-sm">
            <FaUniversity />
          </span>
          NeoBank
        </h1>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        {/* 🌙 Theme */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl p-2 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-800 transition"
        >
          {darkMode ? <FaSun className="text-accent-400" /> : <FaMoon className="text-brand-600" />}
        </button>

        {/* 🔔 Notifications */}
        <div className="relative">

          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="text-xl relative p-2 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-800 transition"
          >
            <FaBell />

            <span className="absolute top-0.5 right-0.5 bg-accent-500 text-[10px] text-white rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-brand-800 shadow-soft-lg rounded-xl overflow-hidden animate-fadeIn">

              <div className="p-3 border-b border-brand-50 dark:border-brand-700 font-semibold">
                Notifications
              </div>

              <div className="p-3 text-sm space-y-1 text-brand-600 dark:text-brand-200">
                <p>✔ Transfer completed</p>
                <p>✔ New account created</p>
                <p>✔ Welcome bonus</p>
              </div>

            </div>
          )}

        </div>

        {/* 👤 Profile */}
        <div className="relative">

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="text-2xl text-brand-700 dark:text-brand-200"
          >
            <FaUserCircle />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-brand-800 shadow-soft-lg rounded-xl overflow-hidden animate-fadeIn">

              <button
                className="block w-full text-left px-4 py-2 hover:bg-brand-50 dark:hover:bg-brand-700 transition"
              >
                Settings
              </button>

              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-rose-500 hover:bg-brand-50 dark:hover:bg-brand-700 transition"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}