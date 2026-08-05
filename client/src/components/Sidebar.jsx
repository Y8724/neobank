import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaWallet,
  FaExchangeAlt,
  FaHistory,
  FaUniversity,
} from "react-icons/fa";

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 p-2.5 rounded-xl transition font-medium ${
      location.pathname === path
        ? "bg-brand-700 text-white shadow-soft"
        : "text-brand-500 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800"
    }`;

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-64
        bg-white dark:bg-brand-900
        shadow-soft-lg z-30

        transform transition-transform duration-300

        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static
      `}
    >
      {/* Close button (mobile) */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 text-xl text-brand-500 dark:text-brand-300"
      >
        ✕
      </button>

      <div className="p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold mb-8 text-brand-800 dark:text-white">
          <span className="p-1.5 rounded-lg bg-brand-700 text-white text-sm">
            <FaUniversity />
          </span>
          NeoBank
        </h2>

        <nav className="space-y-1.5">

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
