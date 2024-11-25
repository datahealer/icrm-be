import express from "express";
import {
  createPurchaseItem,
  getPurchaseItems,
  getPurchaseItemById,
  updatePurchaseItem,
  deletePurchaseItem,
} from "../controllers/purchaseController.js";
import { getAllAssets } from "../controllers/assetController.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

router.post("/purchase-items", createPurchaseItem);
router.get("/purchase-items", getPurchaseItems);
router.get("/get-all-assets", auth, getAllAssets);
router.get("/purchase-items/:id", getPurchaseItemById);
router.put("/purchase-items/:id", updatePurchaseItem);
router.delete("/purchase-items/:id", deletePurchaseItem);

export default router;
