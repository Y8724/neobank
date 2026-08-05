import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { FaPiggyBank, FaWallet, FaBriefcase, FaWandMagicSparkles } from "react-icons/fa6";


const ACCOUNT_ICON = {
  Savings: FaPiggyBank,
  Checking: FaWallet,
  Business: FaBriefcase,
};

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

  const [insight, setInsight] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState("");

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

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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
     AI INSIGHTS
  =============================== */

  const generateInsights = async () => {
    setInsightLoading(true);
    setInsightError("");

    try {
      const res = await api.get("/accounts/summary/ai-insights");
      setInsight(res.data.insight);
    } catch (err) {
      console.error(err);
      setInsightError("Couldn't generate insights right now. Try again in a moment.");
    } finally {
      setInsightLoading(false);
    }
  };


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

      showToast("Deposit successful", "success");

      setShowDeposit(false);
      setDepositAmount("");

      fetchData();

    } catch (err) {

      console.error(err);
      showToast("Deposit failed", "error");
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

      showToast("Transfer completed", "success");

      setShowTransfer(false);
      setTransferAmount("");
      setToAccountId("");

      fetchData();

    } catch (err) {

      console.error(err);
      showToast("Transfer failed", "error");
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
      showToast("Delete failed", "error");
    }
  };


  /* ===============================
     RENDER
  =============================== */

  return (
    <>
      {/* TOAST */}
      {toast.message && (
        <Toast {...toast} onClose={() => setToast({ message: "", type: "info" })} />
      )}


      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-brand-900 dark:text-white">
              Dashboard
            </h1>

            <p className="text-brand-500 dark:text-brand-300 mt-1">
              {getGreeting()},{" "}
              <span className="font-semibold text-brand-800 dark:text-white">
                {user?.name || "User"}
              </span>
            </p>

            <p className="text-sm text-brand-400 dark:text-brand-400 mt-1">
              Here's a quick look at your finances.
            </p>

          </div>

        </div>

      </div>


      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 pb-24">


        {loading && (
          <p className="text-brand-400 dark:text-brand-300 text-center">
            Loading...
          </p>
        )}

        {error && (
          <p className="text-rose-500 text-center">
            {error}
          </p>
        )}


        {/* SUMMARY */}
        {summary && !loading && (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

            <SummaryCard
              title={`${summary.month} Deposits`}
              value={formatMoney(summary.deposits)}
              color="text-emerald-600 dark:text-emerald-400"
            />

            <SummaryCard
              title={`${summary.month} Transfers`}
              value={formatMoney(summary.transfers)}
              color="text-brand-700 dark:text-brand-300"
            />

            <SummaryCard
              title="Net Change"
              value={formatMoney(summary.net)}
              color={summary.net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}
            />

          </div>
        )}


        {/* AI INSIGHTS */}
        {!loading && (
          <div className="card mb-8 bg-gradient-to-br from-brand-800 to-brand-900 text-white border-none">

            <div className="flex items-start justify-between gap-4 flex-wrap">

              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-accent-500/20 text-accent-300">
                  <FaWandMagicSparkles size={18} />
                </span>
                <div>
                  <h3 className="font-semibold">AI Spending Insights</h3>
                  <p className="text-sm text-brand-200">
                    A quick, plain-language read on this month's activity.
                  </p>
                </div>
              </div>

              <button
                onClick={generateInsights}
                disabled={insightLoading}
                className="btn-accent text-sm py-2 disabled:opacity-60 disabled:hover:translate-y-0 whitespace-nowrap"
              >
                {insightLoading ? "Thinking..." : insight ? "Regenerate" : "Generate insights"}
              </button>

            </div>

            {insightError && (
              <p className="text-rose-300 text-sm mt-4">{insightError}</p>
            )}

            {insight && !insightError && (
              <p className="text-brand-50 text-sm leading-relaxed mt-4 border-t border-white/10 pt-4">
                {insight}
              </p>
            )}

          </div>
        )}


        {/* ACCOUNTS */}
        {!loading && accounts.length > 0 && (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {accounts.map((acc) => {
              const Icon = ACCOUNT_ICON[acc.type] || FaWallet;

              return (
              <div
                key={acc.id}
                className="card"
              >

                <div className="flex items-center justify-between">
                  <p className="text-brand-400 dark:text-brand-300 text-sm uppercase tracking-wide font-medium">
                    {acc.type}
                  </p>
                  <span className="p-2 rounded-lg bg-brand-50 dark:bg-brand-800 text-brand-600 dark:text-brand-200">
                    <Icon size={14} />
                  </span>
                </div>

                <h2 className="text-3xl font-bold mt-3 text-brand-900 dark:text-white">
                  {formatMoney(acc.balance)}
                </h2>


                <div className="mt-5 flex flex-wrap gap-2">

                  <button
                    onClick={() => openDeposit(acc)}
                    className="btn-green"
                  >
                    Deposit
                  </button>

                  <button
                    onClick={() => openTransfer(acc)}
                    className="btn-blue"
                  >
                    Transfer
                  </button>

                  <button
                    onClick={() => openDelete(acc)}
                    className="btn-red"
                  >
                    Delete
                  </button>

                </div>

              </div>
              );
            })}
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
            className="input mb-4"
          />

          <button
            onClick={handleDeposit}
            className="btn-primary w-full"
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
            className="input mb-3"
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
            className="input mb-4"
          />


          <button
            onClick={handleTransfer}
            className="btn-primary w-full"
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

          <p className="text-rose-500 mb-4 text-center">
            This action cannot be undone.
          </p>

          <button
            onClick={handleDelete}
            className="btn-danger w-full"
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
    <div className="card">

      <p className="text-brand-400 dark:text-brand-300 text-sm">
        {title}
      </p>

      <h3 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h3>

    </div>
  );
}
