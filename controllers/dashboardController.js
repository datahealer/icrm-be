import Invoice from "../models/Invoice.js";
import PurchaseItem from "../models/PurchaseItems.js";

export const getTotalEarnings = async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      {
        $match: {
          status: "AMOUNT_RECEIVED",
          invoiceAmount: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$invoiceAmount" },
        },
      },
    ]);

    const totalEarnings = result.length > 0 ? result[0].totalEarnings : 0;
    res.status(200).json({
      success: true,
      totalEarnings,
    });
  } catch (error) {
    console.error("Error calculating total earnings:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while calculating total earnings.",
      error: error.message,
    });
  }
};

export const getTotalExpense = async (req, res) => {
  const currentMonth = new Date();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ); // Automatically handles leap years

  try {
    const result = await PurchaseItem.aggregate([
      {
        $match: {
            createdAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalExpenses = result.length > 0 ? result[0].totalExpenses : 0;
    res.status(200).json({
      success: true,
      totalExpenses,
    });
  } catch (error) {
    console.error("Error calculating total expenses:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while calculating total expenses.",
      error: error.message,
    });
  }
};
