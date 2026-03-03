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
      ? "text-blue-600 dark:text-blue-400 font-semibold"
      : "text-gray-600 dark:text-gray-300 hover:text-blue-500";

  return (
    <header className="bg-white dark:bg-gray-800 shadow px-4 md:px-8 py-4 flex justify-between items-center text-gray-900 dark:text-gray-100">

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
        <h1 className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <FaUniversity />
          NeoBank
        </h1>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        {/* 🌙 Theme */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* 🔔 Notifications */}
        <div className="relative">

          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="text-xl relative"
          >
            <FaBell />

            <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-1">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 shadow rounded z-50">

              <div className="p-3 border-b dark:border-gray-600 font-semibold">
                Notifications
              </div>

              <div className="p-3 text-sm">
                ✔ Transfer completed<br />
                ✔ New account created<br />
                ✔ Welcome bonus
              </div>

            </div>
          )}

        </div>

        {/* 👤 Profile */}
        <div className="relative">

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="text-2xl"
          >
            <FaUserCircle />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 shadow rounded z-50">

              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Settings
              </button>

              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
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