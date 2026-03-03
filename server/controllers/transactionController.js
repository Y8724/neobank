import prisma from "../prisma/client.js";

/**
 * Get all transactions for the logged-in user
 */
export const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { account: { userId: req.user.id } },
      orderBy: { createdAt: "desc" },
    });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Transfer money between accounts
 */
export const transfer = async (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;

  if (amount <= 0) return res.status(400).json({ msg: "Invalid amount" });

  try {
    const fromAccount = await prisma.account.findUnique({ where: { id: fromAccountId } });
    const toAccount = await prisma.account.findUnique({ where: { id: toAccountId } });

    if (!fromAccount || !toAccount)
      return res.status(404).json({ msg: "Account not found" });

    if (fromAccount.userId !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    if (fromAccount.balance < amount)
      return res.status(400).json({ msg: "Insufficient balance" });

    // Use a transaction to update balances and create transaction record atomically
    const result = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: fromAccountId },
        data: { balance: fromAccount.balance - amount },
      });

      await tx.account.update({
        where: { id: toAccountId },
        data: { balance: toAccount.balance + amount },
      });

      const transaction = await tx.transaction.create({
        data: {
          amount,
          type: "transfer",
          fromId: fromAccountId,
          toId: toAccountId,
          accountId: fromAccountId,
        },
      });

      return transaction;
    });

    res.json({ transaction: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
// Monthly summary
export const getMonthlySummary = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: {
        account: {
          userId: req.user.id,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    let deposits = 0;
    let transfers = 0;

    transactions.forEach(tx => {
      if (tx.type === "deposit") {
        deposits += tx.amount;
      }

      if (tx.type === "transfer") {
        transfers += tx.amount;
      }
    });

    res.json({
      month: start.toLocaleString("default", { month: "long" }),
      deposits,
      transfers,
      net: deposits - transfers,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};