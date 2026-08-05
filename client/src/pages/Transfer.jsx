import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FaArrowRightArrowLeft } from "react-icons/fa6";


export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  // =========================
  // Load user accounts
  // =========================
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get("/accounts");
        setAccounts(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load accounts");
      }
    };

    fetchAccounts();
  }, []);

  // =========================
  // Submit transfer
  // =========================
  const handleTransfer = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!fromId || !toId || !amount) {
      setError("All fields are required");
      return;
    }

    if (fromId === toId) {
      setError("Cannot transfer to same account");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/accounts/transfer", {
        fromAccountId: Number(fromId),
        toAccountId: Number(toId),
        amount: Number(amount),
      });

      setMessage("Transfer successful");

      setFromId("");
      setToId("");
      setAmount("");

      // Reload balances
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Transfer failed");
      setSubmitting(false);
    }
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="max-w-xl mx-auto">

      <div className="card mt-4">

        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 rounded-lg bg-brand-700 text-white">
            <FaArrowRightArrowLeft size={14} />
          </span>
          <h1 className="text-2xl font-bold text-brand-900 dark:text-white">
            Transfer Money
          </h1>
        </div>

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

        <form
          onSubmit={handleTransfer}
          className="space-y-4"
        >

          {/* FROM */}
          <div>
            <label className="block text-sm text-brand-500 dark:text-brand-300 mb-1">
              From Account
            </label>

            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="input"
            >
              <option value="">Select account</option>

              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.type} — {formatMoney(acc.balance)}
                </option>
              ))}
            </select>
          </div>

          {/* TO */}
          <div>
            <label className="block text-sm text-brand-500 dark:text-brand-300 mb-1">
              To Account
            </label>

            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="input"
            >
              <option value="">Select account</option>

              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.type} — {formatMoney(acc.balance)}
                </option>
              ))}
            </select>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block text-sm text-brand-500 dark:text-brand-300 mb-1">
              Amount
            </label>

            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder="100.00"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? "Sending..." : "Send Money"}
          </button>

        </form>

      </div>

    </div>
  );
}
