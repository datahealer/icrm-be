import { assetData } from "./constant/assets.js";
import Item from "./models/items.js";
import connect from "./config/database.js";

export const insertAsset = async () => {
  const data = assetData;
  await connect();
  try {
    const formattedData = assetData.map((asset) => ({
      category: asset.Category,
      name: asset.Item,
      depreciationRate: asset.Depreciation_Rate,
      itemCode: asset.ItemCode,
    }));
    await Item.insertMany(formattedData, { ordered: false });
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

insertAsset();