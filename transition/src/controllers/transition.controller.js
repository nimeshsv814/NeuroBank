import Transition from "../models/transition.model.js";
import Account from "../models/account.model.js";
import Ledger from "../models/ledger.model.js";
import mongoose from "mongoose";

export const createTransition = async (req, res) => {
  try {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (fromAccount === toAccount) {
      return res.status(400).json({
        message: "Source and destination accounts cannot be the same",
      });
    }

    const fromAccountObj = await Account.findById(fromAccount);
    if (!fromAccountObj) {
      return res.status(400).json({
        message: "Source account does not exist",
      });
    }

    const toAccountObj = await Account.findById(toAccount);
    if (!toAccountObj) {
      return res.status(400).json({
        message: "Invalid account ID. Recipient does not exist.",
      });
    }

    // Validation
    const isTransactionAlreadyExist = await Transition.findOne({
      idempotencyKey,
    });
    if (isTransactionAlreadyExist) {
      const statuses = ["completed", "pending", "failed"];
      if (statuses.includes(isTransactionAlreadyExist.status)) {
        return res.status(400).json({
          message: `Transition rejected: Already ${isTransactionAlreadyExist.status}`,
          transition: isTransactionAlreadyExist,
        });
      }
    }

    // Check Status
    if (
      fromAccountObj.status !== "active" ||
      toAccountObj.status !== "active"
    ) {
      return res.status(400).json({
        message: "Transition rejected: Account is not active",
      });
    }

    // Calculate sender balance from ledger (sum of credits - sum of debits)
    const ledgerEntries = await Ledger.find({ accountId: fromAccount });
    const balance = ledgerEntries.reduce((acc, entry) => {
      return entry.type === "credit" ? acc + entry.amount : acc - entry.amount;
    }, 0);

    if (balance < amount) {
      return res.status(400).json({
        message: "Insufficient amount. Please check your balance.",
        currentBalance: balance,
      });
    }

    // create Transition
    let transition;
    const session = await mongoose.startSession();
    session.startTransaction();

    // First create transition
    transition = (
      await Transition.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "pending",
          },
        ],
        { session },
      )
    )[0];

    // Second create ledger entry for debit
    const debitLedgerEntry = await Ledger.create(
      [
        {
          accountId: fromAccount,
          amount: amount,
          transitionId: transition._id,
          type: "debit",
        },
      ],
      { session },
    );

    // Simulate clearance
    await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

    // Third create ledger entry for credit
    const creditLedgerEntry = await Ledger.create(
      [
        {
          accountId: toAccount,
          amount: amount,
          transitionId: transition._id,
          type: "credit",
        },
      ],
      { session },
    );

    // Update status
    await Transition.findOneAndUpdate(
      { _id: transition._id },
      { status: "completed" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Transition created successfully",
      transition,
      debitLedgerEntry: debitLedgerEntry[0],
      creditLedgerEntry: creditLedgerEntry[0],
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid account ID format. Recipient not found.",
      });
    }
    console.error("Transition Error:", error);
    return res.status(500).json({
      message: "Internal server error during transition",
    });
  }
};

export const getTransitions = async (req, res) => {
  try {
    const { accountId } = req.params;
    if (!accountId) {
      return res.status(400).json({
        message: "Account ID is required",
      });
    }

    const transitions = await Transition.find({
      $or: [{ fromAccount: accountId }, { toAccount: accountId }],
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("fromAccount toAccount", "accountNumber status");

    return res.status(200).json({
      transitions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const generateInitialFunds = async (req, res) => {
  try {
    const { toAccount, amount, idempotencyKey } = req.body;
    if (!toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        message: "All fields are required (toAccount, amount, idempotencyKey)",
      });
    }

    let toUserAccount;
    // Check if toAccount is a valid ObjectId, otherwise treat it as an accountNumber
    if (mongoose.Types.ObjectId.isValid(toAccount)) {
      toUserAccount = await Account.findById(toAccount);
    }

    if (!toUserAccount) {
      toUserAccount = await Account.findOne({ accountNumber: String(toAccount) });
    }

    if (!toUserAccount) {
      return res.status(400).json({
        message: "Target account does not exist. Please check the account ID or number.",
      });
    }

    const fromUserAccount = await Account.findOne({ owner: req.user.id });
    if (!fromUserAccount) {
      return res.status(400).json({
        message: "System account does not exist",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [transition] = await Transition.create(
        [
          {
            fromAccount: fromUserAccount._id,
            toAccount: toUserAccount._id,
            amount: amount,
            idempotencyKey: idempotencyKey,
            status: "pending",
          },
        ],
        { session },
      );

      const debitLedgerEntry = await Ledger.create(
        [
          {
            accountId: fromUserAccount._id,
            amount: amount,
            transitionId: transition._id,
            type: "debit",
          },
        ],
        { session },
      );

      const creditLedgerEntry = await Ledger.create(
        [
          {
            accountId: toUserAccount._id,
            amount: amount,
            transitionId: transition._id,
            type: "credit",
          },
        ],
        { session },
      );

      await Transition.findOneAndUpdate(
        { _id: transition._id },
        { status: "completed" },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        message: "Initial funds generated successfully",
        transition,
        debitLedgerEntry: debitLedgerEntry[0],
        creditLedgerEntry: creditLedgerEntry[0],
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error) {
    console.error("Fund Generation Error:", error);
    return res.status(500).json({
      message: "Internal server error during fund generation",
    });
  }
};
