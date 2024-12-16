import express from "express";
import {
  getTotalEarnings,
  getTotalExpense,
  getProjectAndClientCount,
  getBalance,
  calculateTotalAssetValuation,
  getLastSixMonthsData
} from "../controllers/dashboardController.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

router.get("/getEarnings", auth, getTotalEarnings);
router.get("/getExpenses", auth, getTotalExpense);
router.get("/getProjectAndClientCount", auth, getProjectAndClientCount);
router.get("/getBalance", auth, getBalance);
router.get("/getAssetValuation", auth, calculateTotalAssetValuation);
router.get("/getLastSixMonthsData", auth, getLastSixMonthsData);
export default router;
