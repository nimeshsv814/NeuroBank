import { subscribeToQueue } from "./rabbit.js";
import Account from "../models/account.model.js";

export const startAccountConsumer = async () => {
  try {
    await subscribeToQueue("account.created", async (data) => {
      console.log("Received account.created event:", data);
      const { _id, owner, accountNumber, status } = data;
      
      try {
        await Account.findOneAndUpdate(
          { _id },
          { owner, accountNumber, status },
          { upsert: true, new: true }
        );
        console.log(`Account ${_id} synced successfully`);
      } catch (error) {
        console.error(`Error syncing account ${_id}:`, error);
      }
    });
    console.log("Account consumer started");
  } catch (error) {
    console.error("Failed to start account consumer:", error);
  }
};
