import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaWallet,
  FaExchangeAlt,
  FaHistory,
} from "react-icons/fa";

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 p-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-64
        bg-white dark:bg-gray-800
        shadow-lg z-30

        transform transition-transform duration-300

        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static
      `}
    >
      {/* Close button (mobile) */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 text-xl text-gray-700 dark:text-gray-200"
      >
        ✕
      </button>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-8 text-blue-600">
          NeoBank
        </h2>

        <nav className="space-y-2">

          <Link to="/dashboard" className={linkClass("/dashboard")}>
            <FaHome /> Dashboard
          </Link>

          <Link to="/accounts" className={linkClass("/accounts")}>
            <FaWallet /> Accounts
          </Link>

          <Link to="/transfer" className={linkClass("/transfer")}>
            <FaExchangeAlt /> Transfer
          </Link>

          <Link to="/transactions" className={linkClass("/transactions")}>
            <FaHistory /> History
          </Link>

        </nav>
      </div>
    </aside>
  );
}