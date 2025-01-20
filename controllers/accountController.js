import { Accounts } from "../models/Accounts.js";

export const createAccount = async (req, res) => {
  try {
    const newAccount = new Accounts(req.body);
    await newAccount.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating account",
      error: error.message,
    });
  }
};
export const getAllAccounts = async (req, res) => {
  try {
    const { type } = req.query;

    const query = type ? { type } : {};
    const accounts = await Accounts.find(query);

    res.status(200).json({
      success: true,
      message: "Accounts fetched successfully",
      data: accounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching accounts",
      error: error.message,
    });
  }
};
export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Accounts.findById(id);

    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    res.status(200).json({
      success: true,
      message: "Account fetched successfully",
      data: account,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching account",
      error: error.message,
    });
  }
};
export const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAccount = await Accounts.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAccount) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating account",
      error: error.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAccount = await Accounts.findByIdAndDelete(id);

    if (!deletedAccount) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: deletedAccount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};
