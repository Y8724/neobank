import prisma from "../prisma/client.js";

/**
 * Get all accounts for the logged-in user
 */
export const getAccounts = async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.user.id },
      include: { transactions: true },
    });
    res.json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Create a new account for the logged-in user
 */
export const createAccount = async (req, res) => {
  const { type } = req.body;
  try {
    const account = await prisma.account.create({
      data: {
        type,
        userId: req.user.id,
        balance: 0,
      },
    });
    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

//Deposit function
export const deposit = async (req, res) => {
  const { accountId, amount } = req.body;

  if (!accountId || !amount || amount <= 0) {
    return res.status(400).json({ msg: "Invalid deposit data" });
  }

  try {
    const account = await prisma.account.findUnique({
      where: { id: Number(accountId) },
    });

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    if (account.userId !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Run in transaction
    const result = await prisma.$transaction(async (tx) => {

      // Update balance
      const updatedAccount = await tx.account.update({
        where: { id: Number(accountId) },
        data: {
          balance: account.balance + Number(amount),
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          amount: Number(amount),
          type: "deposit",
          accountId: Number(accountId),
        },
      });

      return { updatedAccount, transaction };
    });

    res.status(200).json({
      msg: "Deposit successful",
      account: result.updatedAccount,
      transaction: result.transaction,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await prisma.account.findUnique({
      where: { id: Number(id) },
    });

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    // Only owner can delete
    if (account.userId !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Optional safety: prevent deleting with money
    if (account.balance !== 0) {
      return res.status(400).json({
        msg: "Withdraw balance before deleting account",
      });
    }

    await prisma.account.delete({
      where: { id: Number(id) },
    });

    res.json({ msg: "Account deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

