import PurchaseItem from "../models/PurchaseItems.js";

// Create a new purchase item
export const createPurchaseItem = async (req, res) => {
  try {
    const { tax, totalAmount } = req.body;
    console.log(req.body);

    let totalGst = 0;
    let totalAmountWithoutGST = totalAmount;


    const taxPercentage = parseFloat(tax.split("-").pop()) || 0;

    if (taxPercentage > 0) {
      totalGst = (totalAmount * taxPercentage) / (100 + taxPercentage);
      totalAmountWithoutGST = totalAmount - totalGst;
    }
    const purchaseItem = new PurchaseItem({
      ...req.body,
      totalGst,
      amountWoGst: totalAmountWithoutGST,
    });
    await purchaseItem.save();
    res.status(201).json(purchaseItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all purchase items
export const getPurchaseItems = async (req, res) => {
  try {
    const purchaseItems = await PurchaseItem.find().populate("vendorId").populate("itemId").populate("salesAccount");
    res.status(200).json(purchaseItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single purchase item by ID
export const getPurchaseItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseItem = await PurchaseItem.findById(id).populate("vendorId");
    if (!purchaseItem) {
      return res.status(404).json({ message: "Purchase item not found" });
    }
    res.status(200).json(purchaseItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a purchase item by ID
export const updatePurchaseItem = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseItem = await PurchaseItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!purchaseItem) {
      return res.status(404).json({ message: "Purchase item not found" });
    }
    res.status(200).json(purchaseItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a purchase item by ID
export const deletePurchaseItem = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseItem = await PurchaseItem.findByIdAndDelete(id);
    if (!purchaseItem) {
      return res.status(404).json({ message: "Purchase item not found" });
    }
    res.status(204).json({ message: "Purchase item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
