import express from "express";
import { getTotalEarnings, getTotalExpense } from "../controllers/dashboardController.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

router.get("/getEarnings", auth, getTotalEarnings);
router.get("/getExpenses", auth, getTotalExpense);
export default router;
