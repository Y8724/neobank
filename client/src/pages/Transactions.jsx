import { useEffect, useState } from "react";
import api from "../api";
import { FaArrowDown, FaArrowRightArrowLeft } from "react-icons/fa6";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch transactions
  // =========================
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/accounts/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // =========================
  // Helpers
  // =========================
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-brand-900 dark:text-white">
        Transaction History
      </h1>

      {loading && (
        <p className="text-brand-400 dark:text-brand-300">
          Loading transactions...
        </p>
      )}

      {error && (
        <p className="text-rose-500">
          {error}
        </p>
      )}

      {!loading && transactions.length === 0 && (
        <p className="text-brand-400 dark:text-brand-300">
          No transactions yet.
        </p>
      )}

      {!loading && transactions.length > 0 && (

        <div className="card divide-y divide-brand-50 dark:divide-brand-800 p-0 overflow-hidden">

          {transactions.map((tx) => {
            const isDeposit = tx.type === "deposit";
            const Icon = isDeposit ? FaArrowDown : FaArrowRightArrowLeft;

            return (

            <div
              key={tx.id}
              className="p-4 flex justify-between items-center hover:bg-brand-50/50 dark:hover:bg-brand-800/50 transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-3">

                <span
                  className={`p-2.5 rounded-xl ${
                    isDeposit
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-200"
                  }`}
                >
                  <Icon size={14} />
                </span>

                <div>
                  <p className="font-semibold text-brand-900 dark:text-white capitalize">
                    {tx.type}
                  </p>

                  <p className="text-sm text-brand-400 dark:text-brand-400">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <div className="text-right">

                <p
                  className={`font-bold ${
                    isDeposit
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-brand-700 dark:text-brand-200"
                  }`}
                >
                  {formatMoney(tx.amount)}
                </p>

                {tx.fromId && tx.toId && (
                  <p className="text-xs text-brand-400 dark:text-brand-400">
                    {tx.fromId} → {tx.toId}
                  </p>
                )}

              </div>

            </div>
            );
          })}

        </div>

      )}

    </div>
  );
}
