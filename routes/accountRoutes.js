import express from "express";
import {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
} from "../controllers/accountController.js";

import { auth } from "../middleware/Auth.js";
const router = express.Router();

router.post("/", auth, createAccount);

router.get("/", auth, getAllAccounts);

router.get("/:id", auth, getAccountById);

router.put("/:id", auth, updateAccount);

router.delete("/:id", auth, deleteAccount);

export default router;
