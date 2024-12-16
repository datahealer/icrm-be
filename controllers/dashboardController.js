import Invoice from "../models/Invoice.js";
import PurchaseItem from "../models/PurchaseItems.js";
import Client from "../models/Client.js";
import Project from "../models/Project.js";
import { currency } from "../constant/currency.js";

export const getTotalEarnings = async (req, res) => {
  try {
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
    );
    const result = await Invoice.aggregate([
      {
        $match: {
          status: "AMOUNT_RECEIVED",
          invoiceAmount: { $exists: true, $ne: null },
          createdAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
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


  try {
    const result = await PurchaseItem.aggregate([
      
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

export const getProjectAndClientCount = async (req, res) => {
  try {
    const today = new Date();
    const clientCount = await Client.countDocuments({
      serviceStartDate: { $lt: today },
    });
    const projectCount = await Project.countDocuments({
      startDate: { $lt: today },
    });
    res.status(200).json({ projectCount, clientCount });
  } catch (error) {
    console.error("Error fetching client count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBalance = async (req, res) => {
  try {
    const earningsResult = await Invoice.aggregate([
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

    const totalEarnings =
      earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

    const expensesResult = await PurchaseItem.aggregate([
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalExpenses =
      expensesResult.length > 0 ? expensesResult[0].totalExpenses : 0;
    const convertedTotalExpenses = totalExpenses / currency.USD["INR"];

    const balance = (totalEarnings - convertedTotalExpenses).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        balance,
      },
    });
  } catch (error) {
    console.error("Error calculating balance:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while calculating balance.",
      error: error.message,
    });
  }
};

export const calculateTotalAssetValuation = async (req, res) => {
  try {
    const results = await PurchaseItem.aggregate([
      {
        $lookup: {
          from: "items",
          localField: "itemId",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      { $unwind: "$itemDetails" },
      {
        $addFields: {
          yearSincePurchase: {
            $dateDiff: {
              startDate: "$createdAt",
              endDate: "$$NOW",
              unit: "year",
            },
          },
        },
      },
      {
        $addFields: {
          currentValue: {
            $multiply: [
              "$totalAmount",
              {
                $pow: [
                  {
                    $subtract: [
                      1,
                      { $divide: ["$itemDetails.depreciationRate", 100] },
                    ],
                  },
                  "$yearSincePurchase",
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalValuation: { $sum: "$currentValue" },
        },
      },
      {
        $project: {
          _id: 0,
          totalValuation: { $round: ["$totalValuation", 2] },
        },
      },
    ]);

    const totalValuation = results[0]?.totalValuation || 0;
    const convertedValuation = (totalValuation / currency.USD["INR"]).toFixed(
      2
    );
    return res
      .status(200)
      .json({ success: true, totalValuation: convertedValuation });
  } catch (error) {
    console.error("Error calculating total asset valuation:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};








export const getLastSixMonthsData = async (req, res) => {
  try {
    const currentDate = new Date();
    const monthsData = [];

    for (let i = 0; i < 6; i++) {
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        0
      );

      // Fetch total earnings and expenses for the month
      const [earningsResult, expensesResult] = await Promise.all([
        Invoice.aggregate([
          {
            $match: {
              status: "AMOUNT_RECEIVED",
              invoiceAmount: { $exists: true, $ne: null },
              createdAt: {
                $gte: firstDayOfMonth,
                $lte: lastDayOfMonth,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalEarnings: { $sum: "$invoiceAmount" },
            },
          },
        ]),
        PurchaseItem.aggregate([
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
        ]),
      ]);

      const totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;
      const totalExpenses = expensesResult.length > 0 ? expensesResult[0].totalExpenses : 0;

     
      monthsData.push({
        month: firstDayOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
        totalEarnings,
        totalExpenses,
      });
    }

    console.log(monthsData, "dwhiu")
    res.status(200).json({
      success: true,
      data: monthsData.reverse(), 
    });
  } catch (error) {
    console.error("Error calculating last six months data:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while calculating last six months data.",
      error: error.message,
    });
  }
};
