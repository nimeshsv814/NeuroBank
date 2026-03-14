import Account from "../models/account.model.js";
import generateAccountNumber from "../utils/generateNumber.js";

export const createAccount = async (req, res) => {
  try {
    const accountExists = await Account.findOne({
      owner: req.user.id,
    });
    if (accountExists) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }
    const account = await Account.create({
      owner: req.user.id,
      accountNumber: generateAccountNumber(),
      accountType: "saving",
      balance: 0,
      currency: "INR",
      status: "active",
    });
    return res.status(201).json({ message: "Account Created", account });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getBalance = async (req, res) => {
  try {
    const account = await Account.findOne({
      owner: req.user.id,
    });
    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }
    return res.status(200).json({ message: "Balance Retrieved", account });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const user = async (req, res) => {
  try {
    const owner = req.user;
    if (!owner) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({ message: "User Retrieved", owner });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
