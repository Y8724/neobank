import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";


export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

    try {
      await api.post("/accounts/transfer", {
        fromAccountId: Number(fromId),
        toAccountId: Number(toId),
        amount: Number(amount),
      });

      setMessage("Transfer successful ✅");

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
    }
  };

  // =========================
  // Render
  // =========================
  return (
    <>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">

      <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-700 p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">
          Transfer Money
        </h1>

        {error && (
          <p className="text-red-500 mb-3">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-600 mb-3">
            {message}
          </p>
        )}

        <form
          onSubmit={handleTransfer}
          className="space-y-4"
        >

          {/* FROM */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-100 mb-1">
              From Account
            </label>

            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="w-full border p-2 rounded dark:bg-gray-400 dark:text-gray-800"
            >
              <option value="">Select account</option>

              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.type} — ${acc.balance}
                </option>
              ))}
            </select>
          </div>

          {/* TO */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-100 mb-1">
              To Account
            </label>

            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full border p-2 rounded dark:bg-gray-400 dark:text-gray-800"
            >
              <option value="">Select account</option>

              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.type} — ${acc.balance}
                </option>
              ))}
            </select>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-100 mb-1">
              Amount
            </label>

            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded dark:text-gray-900"
              placeholder="100.00"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Send Money
          </button>

        </form>

      </div>

    </div>
 </>
  );
}
