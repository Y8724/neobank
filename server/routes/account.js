import express from "express";
import { getAccounts, createAccount, deposit, deleteAccount } from "../controllers/accountController.js";
import { getTransactions, transfer, getMonthlySummary, getAIInsights } from "../controllers/transactionController.js";
import auth from "../middleware/auth.js";



const router = express.Router();

// Accounts
router.get("/", auth, getAccounts);
router.post("/", auth, createAccount);
router.post("/deposit", auth, deposit);
router.delete("/:id", auth, deleteAccount);

// Transactions
router.get("/transactions", auth, getTransactions);
router.post("/transfer", auth, transfer);


// =====================
// SUMMARY
// =====================
router.get("/summary/monthly", auth, getMonthlySummary);
router.get("/summary/ai-insights", auth, getAIInsights);




export default router;
