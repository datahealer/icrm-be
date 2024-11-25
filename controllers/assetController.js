import Item from "../models/items.js";

export const getAllAssets = async (req, res) => {
  try {
    const response = await Item.find();
    res.status(200).json({
      status: "success",
      results: response.length,
      data: {
        response,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
