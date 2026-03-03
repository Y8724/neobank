import { useEffect, useState } from "react";
import api from "../api";

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
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">

        <div className="max-w-5xl mx-auto px-6 mt-10">

          <h1 className="text-3xl font-bold mb-6">
            Transaction History
          </h1>

          {loading && (
            <p className="text-gray-600">
              Loading transactions...
            </p>
          )}

          {error && (
            <p className="text-red-500">
              {error}
            </p>
          )}

          {!loading && transactions.length === 0 && (
            <p className="text-gray-500">
              No transactions yet.
            </p>
          )}

          {!loading && transactions.length > 0 && (

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow divide-y">

              {transactions.map((tx) => (

                <div
                  key={tx.id}
                  className="p-4 flex justify-between items-center"
                >

                  {/* LEFT */}
                  <div>

                    <p className="font-semibold text-gray-800">
                      {tx.type.toUpperCase()}
                    </p>

                    <p className="text-sm text-gray-500">
                      {formatDate(tx.createdAt)}
                    </p>

                  </div>

                  {/* RIGHT */}
                  <div className="text-right">

                    <p
                      className={`font-bold ${
                        tx.type === "deposit"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {formatMoney(tx.amount)}
                    </p>

                    {tx.fromId && tx.toId && (
                      <p className="text-xs text-gray-500">
                        {tx.fromId} → {tx.toId}
                      </p>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </>
  );
}
