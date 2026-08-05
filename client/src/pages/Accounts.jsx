import { useEffect, useState } from "react";
import api from "../api";
import { FaWallet } from "react-icons/fa";
import { FaPiggyBank, FaBriefcase } from "react-icons/fa6";

const ACCOUNT_ICON = {
  Savings: FaPiggyBank,
  Checking: FaWallet,
  Business: FaBriefcase,
};

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  // ======================
  // Load accounts
  // ======================
  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts");
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load accounts");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ======================
  // Create account
  // ======================
  const handleCreate = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!type) {
      setError("Select account type");
      return;
    }

    try {
      await api.post("/accounts", {
        type,
      });

      setMessage("Account created");
      setType("");

      // Reload list
      fetchAccounts();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Create failed");
    }
  };

  // Delete account
const handleDelete = async (id) => {
  const confirm = window.confirm(
    "Are you sure? Account must have $0 balance."
  );

  if (!confirm) return;

  try {
    await api.delete(`/accounts/${id}`);

    setMessage("Account deleted");

    fetchAccounts();

  } catch (err) {
    console.error(err);

    setError(
      err.response?.data?.msg || "Delete failed"
    );
  }
};


  // ======================
  // Render
  // ======================
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2 rounded-lg bg-brand-700 text-white">
          <FaWallet size={16} />
        </span>

        <h1 className="text-3xl font-bold text-brand-900 dark:text-white">
          My Accounts
        </h1>
      </div>


      {/* CREATE FORM */}
      <form
        onSubmit={handleCreate}
        className="card mb-6 flex flex-wrap gap-4 items-center"
      >

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input w-48"
        >
          <option value="">Select type</option>
          <option value="Savings">Savings</option>
          <option value="Checking">Checking</option>
          <option value="Business">Business</option>
        </select>

        <button
          type="submit"
          className="btn-primary"
        >
          Create Account
        </button>

      </form>

      {/* STATUS */}
      {error && (
        <p className="text-rose-500 mb-3">
          {error}
        </p>
      )}

      {message && (
        <p className="text-emerald-600 dark:text-emerald-400 mb-3">
          {message}
        </p>
      )}

      {/* ACCOUNTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {accounts.map(account => {
          const Icon = ACCOUNT_ICON[account.type] || FaWallet;

          return (

          <div key={account.id} className="card">

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-brand-900 dark:text-white">
                {account.type}
              </h2>
              <span className="p-2 rounded-lg bg-brand-50 dark:bg-brand-800 text-brand-600 dark:text-brand-200">
                <Icon size={14} />
              </span>
            </div>

            <p className="text-2xl font-bold text-brand-700 dark:text-brand-300 mb-2">
              {formatMoney(account.balance)}
            </p>

            <p className="text-brand-400 dark:text-brand-400 text-sm mb-3">
              Account ID: {account.id}
            </p>

            <button
              onClick={() => handleDelete(account.id)}
              className="btn-red"
            >
              Delete
            </button>

          </div>
          );
        })}

      </div>

      {/* EMPTY */}
      {accounts.length === 0 && (
        <p className="text-brand-400 dark:text-brand-300 mt-6">
          No accounts yet.
        </p>
      )}
   </>
  );
}
