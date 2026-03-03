import { useEffect, useState } from "react";
import api from "../api";
import { FaWallet } from "react-icons/fa";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

      setMessage("Account created ✅");
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

    setMessage("Account deleted ✅");

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
      <div className="flex items-center gap-2 mb-6">
        <FaWallet className="text-blue-500" />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          My Accounts
        </h1>
      </div>
     

      {/* CREATE FORM */}
      <form
        onSubmit={handleCreate}
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6 flex gap-4 items-center"
      >

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input w-48 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 "
        >
          <option value="" className="dark:bg-gray-800 dark:text-gray-100">
            Select type
          </option>

          <option value="Savings" className="dark:bg-gray-800 dark:text-gray-100">
            Savings
          </option>

          <option value="Checking" className="dark:bg-gray-800 dark:text-gray-100">
            Checking
          </option>

          <option value="Business" className="dark:bg-gray-800 dark:text-gray-100">
            Business
          </option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create Account
        </button>

      </form>

      {/* STATUS */}
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

      {/* ACCOUNTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {accounts.map(account => (

          <div
  key={account.id}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
  >

    <h2 className="text-xl font-semibold mb-2">
      {account.type}
    </h2>

    <p className="text-2xl font-bold text-blue-600 mb-2">
      ${account.balance}
    </p>

    <p className="text-gray-500 mb-3">
      Account ID: {account.id}
    </p>

    <button
      onClick={() => handleDelete(account.id)}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
    >
      Delete
    </button>

</div>


        ))}

      </div>

      {/* EMPTY */}
      {accounts.length === 0 && (
        <p className="text-gray-500 mt-6">
          No accounts yet.
        </p>
      )}
   </>
  );
}
