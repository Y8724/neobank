import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Modal from "../components/Modal";
import Toast from "../components/Toast";


export default function Dashboard() {

  /* ===============================
     STATE
  =============================== */

  const [accounts, setAccounts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeAccount, setActiveAccount] = useState(null);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [depositAmount, setDepositAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [toAccountId, setToAccountId] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "info",
  });

  const navigate = useNavigate();

  /* ===============================
     TOAST
  =============================== */

  const showToast = (message, type = "info") => {

    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "info" });
    }, 3000);
  };


  /* ===============================
     GREETING
  =============================== */

  const getGreeting = () => {

    const hour = new Date().getHours();

    if (hour < 12) return "Good morning ☀️";
    if (hour < 18) return "Good afternoon 🌤️";
    return "Good evening 🌙";
  };


  /* ===============================
     AUTH
  =============================== */

  useEffect(() => {

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

  }, [navigate]);


  /* ===============================
     FETCH DATA
  =============================== */

  const fetchData = async () => {

    try {

      setLoading(true);

      const [accRes, sumRes] = await Promise.all([
        api.get("/accounts"),
        api.get("/accounts/summary/monthly"),
      ]);

      setAccounts(accRes.data);
      setSummary(sumRes.data);

    } catch (err) {

      console.error(err);
      setError("Failed to load dashboard");

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  /* ===============================
     FORMAT MONEY
  =============================== */

  const formatMoney = (amount) => {

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };


  /* ===============================
     MODAL OPENERS
  =============================== */

  const openDeposit = (acc) => {
    setActiveAccount(acc);
    setDepositAmount("");
    setShowDeposit(true);
  };

  const openTransfer = (acc) => {
    setActiveAccount(acc);
    setTransferAmount("");
    setToAccountId("");
    setShowTransfer(true);
  };

  const openDelete = (acc) => {
    setActiveAccount(acc);
    setShowDelete(true);
  };


  /* ===============================
     DEPOSIT
  =============================== */

  const handleDeposit = async () => {

    if (!depositAmount || Number(depositAmount) <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }

    try {

      await api.post("/accounts/deposit", {
        accountId: activeAccount.id,
        amount: Number(depositAmount),
      });

      showToast("Deposit successful ✅", "success");

      setShowDeposit(false);
      setDepositAmount("");

      fetchData();

    } catch (err) {

      console.error(err);
      showToast("Deposit failed ❌", "error");
    }
  };


  /* ===============================
     TRANSFER
  =============================== */

  const handleTransfer = async () => {

    if (!toAccountId || !transferAmount) {
      showToast("Fill all fields", "error");
      return;
    }

    if (Number(transferAmount) <= 0) {
      showToast("Amount must be positive", "error");
      return;
    }

    try {

      await api.post("/accounts/transfer", {
        fromAccountId: activeAccount.id,
        toAccountId: Number(toAccountId),
        amount: Number(transferAmount),
      });

      showToast("Transfer completed ✅", "success");

      setShowTransfer(false);
      setTransferAmount("");
      setToAccountId("");

      fetchData();

    } catch (err) {

      console.error(err);
      showToast("Transfer failed ❌", "error");
    }
  };


  /* ===============================
     DELETE
  =============================== */

  const handleDelete = async () => {

    try {

      await api.delete(`/accounts/${activeAccount.id}`);

      showToast("Account deleted", "success");

      setShowDelete(false);
      setActiveAccount(null);

      fetchData();

    } catch (err) {

      console.error(err);
      showToast("Delete failed ❌", "error");
    }
  };


  /* ===============================
     RENDER
  =============================== */

  return (
    <>
      {/* TOAST */}
      {toast.message && <Toast {...toast} />}


      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Dashboard
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {getGreeting()},{" "}
              <span className="font-semibold">
                {user?.name || "User"}
              </span>{" "}
              👋
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Here’s a quick look at your finances.
            </p>

          </div>

        </div>

      </div>


      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 pb-24">


        {loading && (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Loading...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center">
            {error}
          </p>
        )}


        {/* SUMMARY */}
        {summary && !loading && (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

            <SummaryCard
              title={`${summary.month} Deposits`}
              value={formatMoney(summary.deposits)}
              color="text-green-600"
            />

            <SummaryCard
              title={`${summary.month} Transfers`}
              value={formatMoney(summary.transfers)}
              color="text-red-600"
            />

            <SummaryCard
              title="Net Change"
              value={formatMoney(summary.net)}
              color={summary.net >= 0 ? "text-green-600" : "text-red-600"}
            />

          </div>
        )}


        {/* ACCOUNTS */}
        {!loading && accounts.length > 0 && (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {accounts.map((acc) => (

              <div
                key={acc.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
              >

                <p className="text-gray-500 dark:text-gray-400 text-sm uppercase">
                  {acc.type}
                </p>

                <h2 className="text-3xl font-bold mt-3 text-gray-800 dark:text-gray-100">
                  {formatMoney(acc.balance)}
                </h2>


                <div className="mt-5 flex flex-wrap gap-3">

                  <button
                    onClick={() => openDeposit(acc)}
                    className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition"
                  >
                    Deposit
                  </button>

                  <button
                    onClick={() => openTransfer(acc)}
                    className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  >
                    Transfer
                  </button>

                  <button
                    onClick={() => openDelete(acc)}
                    className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}


        {/* DEPOSIT MODAL */}
        <Modal
          isOpen={showDeposit}
          onClose={() => setShowDeposit(false)}
          title="Deposit"
        >

          <input
            type="number"
            placeholder="Amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full border p-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
          />

          <button
            onClick={handleDeposit}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Confirm
          </button>

        </Modal>


        {/* TRANSFER MODAL */}
        <Modal
          isOpen={showTransfer}
          onClose={() => setShowTransfer(false)}
          title="Transfer"
        >

          <select
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            className="w-full border p-2 rounded mb-3 dark:bg-gray-700 dark:text-white"
          >

            <option value="">
              Select destination account
            </option>

            {accounts
              .filter(acc => acc.id !== activeAccount?.id)
              .map(acc => (

                <option key={acc.id} value={acc.id}>
                  {acc.type} — {formatMoney(acc.balance)}
                </option>

              ))}

          </select>


          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="w-full border p-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
          />


          <button
            onClick={handleTransfer}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Confirm
          </button>

        </Modal>


        {/* DELETE MODAL */}
        <Modal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          title="Delete Account"
        >

          <p className="text-red-600 mb-4 text-center">
            This action cannot be undone.
          </p>

          <button
            onClick={handleDelete}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>

        </Modal>
      </div>
     </>
  );
}


/* ===============================
   SMALL COMPONENT
=============================== */

function SummaryCard({ title, value, color }) {

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {title}
      </p>

      <h3 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h3>

    </div>
  );
}