import { subscribeToQueue } from "./rabbit.js";
import Account from "../models/account.model.js";

export const startTransitionConsumer = async () => {
  try {
    await subscribeToQueue("transition.completed", async (data) => {
      const { fromAccount, toAccount, amount } = data;

      try {
        // Update sender balance (Debit) - SKIP if minting from system (null fromAccount)
        if (fromAccount) {
          const senderAccount = await Account.findByIdAndUpdate(
            fromAccount,
            { $inc: { balance: -amount } },
            { new: true }
          );

          if (senderAccount) {
            console.log(`Account ${fromAccount} debited by ${amount}. New balance: ${senderAccount.balance}`);
          } else {
            console.error(`Sender account ${fromAccount} not found during balance sync`);
          }
        } else {
          console.log(`System minting: No sender account to debit.`);
        }

        // Update receiver balance (Credit)
        const receiverAccount = await Account.findByIdAndUpdate(
          toAccount,
          { $inc: { balance: amount } },
          { new: true }
        );

        if (receiverAccount) {
          console.log(`Account ${toAccount} credited by ${amount}. New balance: ${receiverAccount.balance}`);
        } else {
          console.error(`Receiver account ${toAccount} not found during balance sync`);
        }
      } catch (error) {
        console.error(`Error syncing balances for transition:`, error);
      }
    });
    console.log("Transition consumer started");
  } catch (error) {
    console.error("Failed to start transition consumer:", error);
  }
};
