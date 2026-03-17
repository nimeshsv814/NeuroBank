import Transition from "../models/transition.model.js";
import Account from "../models/account.model.js";
import Ledger from "../models/ledger.model.js";
import mongoose from "mongoose";

export const createTransition = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const fromAccountObj = await Account.findById(fromAccount);
  if (!fromAccountObj) {
    return res.status(400).json({
      message: "From account does not exist",
    });
  }

  const toAccountObj = await Account.findById(toAccount);
  if (!toAccountObj) {
    return res.status(400).json({
      message: "To account does not exist",
    });
  }

  // Validation
  const isTransactionAlreadyExist = await Transition.findOne({
    idempotencyKey,
  });
  if (isTransactionAlreadyExist) {
    if (isTransactionAlreadyExist.status === "completed") {
      return res.status(400).json({
        message: "Transaction already exist",
        transition: isTransactionAlreadyExist,
      });
    }
    if (isTransactionAlreadyExist.status === "pending") {
      return res.status(400).json({
        message: "Transaction is pending",
        transition: isTransactionAlreadyExist,
      });
    }
    if (isTransactionAlreadyExist.status === "failed") {
      return res.status(400).json({
        message: "Transaction is failed",
        transition: isTransactionAlreadyExist,
      });
    }
  }

  // Check Amount
  if (fromAccountObj.status !== "active" || toAccountObj.status !== "active") {
    return res.status(400).json({
      message: "From account or to account is not active",
    });
  }

  // Derive sender balance from ledger
  const senderBalance = await Ledger.findOne({
    accountId: fromAccount,
  });
  if (!senderBalance) {
    return res.status(400).json({
      message: "From account does not have a balance",
    });
  }
  if (senderBalance.balance < amount) {
    return res.status(400).json({
      message: "From account does not have sufficient balance",
    });
  }

  // create Transition
  let transition;
  try {
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
    await new Promise((resolve) => {
      setTimeout(resolve, 15 * 1000);
    });

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

    // Fourth commit transaction

    await Transition.findOneAndUpdate(
      {
        _id: transition._id,
      },
      {
        status: "completed",
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    // Email
    // await sendEmail({
    //   to: fromAccountObj.email,
    //   subject: "Transition Completed",
    //   text: `Your transition of ${amount} to account ${toAccountObj.name} has been completed.`,
    // });

    return res.status(201).json({
      message: "Transition created successfully",
      transition,
      debitLedgerEntry,
      creditLedgerEntry,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
